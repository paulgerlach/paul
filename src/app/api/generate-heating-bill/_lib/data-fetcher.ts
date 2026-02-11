/**
 * Parallel data loading for heating bill computation.
 * Uses Supabase RPC for meter readings, database for the rest.
 */
import { createClient } from "@supabase/supabase-js";
import database from "@/db";
import {
  heating_bill_documents,
  heating_invoices,
  objekte,
  locals,
  contracts,
  contractors,
  local_meters,
  users,
} from "@/db/drizzle/schema";
import { eq, and, inArray } from "drizzle-orm";
import type { MeterReadingType } from "@/api";

export interface HeatingBillRawData {
  mainDoc: {
    id: string;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    living_space_share: string | null;
    consumption_dependent: string | null;
    objekt_id: string | null;
    local_id: string | null;
    user_id: string | null;
  } | null;
  objekt: {
    id: string;
    street: string;
    zip: string;
    user_id: string;
    heating_systems: unknown;
  } | null;
  locals: Array<{
    id: string;
    living_space: string;
    objekt_id: string;
    floor?: string;
    house_location?: string | null;
  }>;
  invoices: Array<{
    id: string;
    cost_type: string | null;
    total_amount: string | null;
    invoice_date: string | null;
    document_name: string | null;
    purpose: string | null;
    notes: string | null;
    heating_doc_id: string | null;
  }>;
  contractsWithContractors: Array<{
    id: string;
    rental_start_date: string;
    rental_end_date: string | null;
    additional_costs: string | null;
    contractors: Array<{ first_name: string; last_name: string; id: string }>;
  }>;
  user: {
    first_name: string | null;
    last_name: string | null;
    id: string;
  } | null;
  meterReadings: MeterReadingType[];
  /** Maps device_id (meter_number) to local_id for filtering unit-level readings */
  localMeters: Array<{ meter_number: string | null; local_id: string | null }>;
}

export async function fetchHeatingBillData(
  docId: string,
  userId: string,
  options?: { useServiceRole?: boolean }
): Promise<HeatingBillRawData> {
  const useServiceRole = options?.useServiceRole ?? true;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase =
    useServiceRole && serviceRoleKey
      ? createClient(supabaseUrl!, serviceRoleKey)
      : null;

  const [
    mainDocResult,
    invoicesResult,
    userResult,
  ] = await Promise.all([
    database
      .select()
      .from(heating_bill_documents)
      .where(
        and(
          eq(heating_bill_documents.id, docId),
          eq(heating_bill_documents.user_id, userId)
        )
      )
      .then((r) => r[0] ?? null),
    database
      .select()
      .from(heating_invoices)
      .where(
        and(
          eq(heating_invoices.heating_doc_id, docId),
          eq(heating_invoices.user_id, userId)
        )
      ),
    database
      .select({ first_name: users.first_name, last_name: users.last_name, id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .then((r) => r[0] ?? null),
  ]);

  const mainDoc = mainDocResult;
  const invoices = invoicesResult;
  const user = userResult;
  const objektId = mainDoc?.objekt_id;

  if (!objektId) {
    return {
      mainDoc: mainDoc ? {
        id: mainDoc.id,
        start_date: mainDoc.start_date,
        end_date: mainDoc.end_date,
        created_at: mainDoc.created_at,
        living_space_share: mainDoc.living_space_share,
        consumption_dependent: mainDoc.consumption_dependent,
        objekt_id: mainDoc.objekt_id,
        local_id: mainDoc.local_id,
        user_id: mainDoc.user_id,
      } : null,
      objekt: null,
      locals: [],
      invoices: invoices.map((i) => ({
        id: i.id,
        cost_type: i.cost_type,
        total_amount: i.total_amount,
        invoice_date: i.invoice_date,
        document_name: i.document_name,
        purpose: i.purpose,
        notes: i.notes,
        heating_doc_id: i.heating_doc_id,
      })),
      contractsWithContractors: [],
      user: user ? { first_name: user.first_name, last_name: user.last_name, id: user.id } : null,
      meterReadings: [],
      localMeters: [],
    };
  }

  const [objektResult, localsResult] = await Promise.all([
    database.select().from(objekte).where(eq(objekte.id, objektId)).then((r) => r[0] ?? null),
    database.select({ id: locals.id, living_space: locals.living_space, objekt_id: locals.objekt_id, floor: locals.floor, house_location: locals.house_location }).from(locals).where(eq(locals.objekt_id, objektId)),
  ]);

  const localIdsForContracts = localsResult.map((l) => l.id);
  const contractsResult =
    localIdsForContracts.length > 0
      ? await database
        .select()
        .from(contracts)
        .where(inArray(contracts.local_id, localIdsForContracts))
        .then(async (c) => {
          if (c.length === 0) return [];
          const withContractors = await Promise.all(
            c.map(async (contract) => {
              const ct = await database
                .select()
                .from(contractors)
                .where(eq(contractors.contract_id, contract.id));
              return {
                ...contract,
                contractors: ct,
              };
            })
          );
          return withContractors;
        })
      : [];

  const allLocals = localsResult;
  const localIds = allLocals.map((l) => l.id);
  const localMetersRows = (
    await Promise.all(
      localIds.map((lid) =>
        database
          .select({ id: local_meters.id, meter_number: local_meters.meter_number, local_id: local_meters.local_id })
          .from(local_meters)
          .where(eq(local_meters.local_id, lid))
      )
    )
  ).flat();
  const meterIds = localMetersRows.map((m) => m.id).filter(Boolean);
  const localMeters = localMetersRows.map((m) => ({
    meter_number: m.meter_number,
    local_id: m.local_id,
  }));

  let meterReadings: MeterReadingType[] = [];
  if (supabase && meterIds.length > 0 && mainDoc?.start_date && mainDoc?.end_date) {
    const startDate = new Date(mainDoc.start_date);
    const endDate = new Date(mainDoc.end_date);
    startDate.setDate(startDate.getDate() - 7);
    const { data: rpcData, error } = await supabase.rpc("get_dashboard_data", {
      p_local_meter_ids: meterIds,
      p_device_types: [
        "Heat",
        "Water",
        "WWater",
        "Wärmemengenzähler",
        "Kaltwasserzähler",
        "Warmwasserzähler",
      ],
      p_start_date: startDate.toISOString().split("T")[0],
      p_end_date: endDate.toISOString().split("T")[0],
    });
    if (!error && rpcData?.length) {
      meterReadings = (rpcData as any[]).map((record: any) => {
        const parsedDataJson = record.parsed_data || {};
        return {
          "Frame Type": record.frame_type || "",
          Manufacturer: record.manufacturer || "",
          ID: record.device_id,
          "Device Type": record.device_type,
          ...parsedDataJson,
        } as MeterReadingType;
      });
    }
  }

  const contractsWithContractors =
    Array.isArray(contractsResult) ? contractsResult : [];

  return {
    mainDoc: mainDoc
      ? {
        id: mainDoc.id,
        start_date: mainDoc.start_date,
        end_date: mainDoc.end_date,
        created_at: mainDoc.created_at,
        living_space_share: mainDoc.living_space_share,
        consumption_dependent: mainDoc.consumption_dependent,
        objekt_id: mainDoc.objekt_id,
        local_id: mainDoc.local_id,
        user_id: mainDoc.user_id,
      }
      : null,
    objekt: objektResult
      ? {
        id: objektResult.id,
        street: objektResult.street,
        zip: objektResult.zip,
        user_id: objektResult.user_id,
        heating_systems: objektResult.heating_systems,
      }
      : null,
    locals: allLocals.map((l) => ({
      id: l.id,
      living_space: l.living_space,
      objekt_id: l.objekt_id,
      floor: l.floor,
      house_location: l.house_location,
    })),
    invoices: invoices.map((i) => ({
      id: i.id,
      cost_type: i.cost_type,
      total_amount: i.total_amount,
      invoice_date: i.invoice_date,
      document_name: i.document_name,
      purpose: i.purpose,
      notes: i.notes,
      heating_doc_id: i.heating_doc_id,
    })),
    contractsWithContractors: contractsWithContractors.map((c) => ({
      id: c.id,
      rental_start_date: c.rental_start_date,
      rental_end_date: c.rental_end_date,
      additional_costs: c.additional_costs,
      contractors: c.contractors.map((ct) => ({
        first_name: ct.first_name,
        last_name: ct.last_name,
        id: ct.id,
      })),
    })),
    user: user
      ? { first_name: user.first_name, last_name: user.last_name, id: user.id }
      : null,
    meterReadings,
    localMeters,
  };
}
