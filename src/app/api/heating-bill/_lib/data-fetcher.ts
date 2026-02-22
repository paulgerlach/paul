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
import { eq, inArray } from "drizzle-orm";
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
    local_id: string | null;
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
  objektOwner?: {
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

  if (useServiceRole && (!serviceRoleKey || !supabaseUrl)) {
    const missing = supabaseUrl ? "SUPABASE_SERVICE_ROLE_KEY" : "NEXT_PUBLIC_SUPABASE_URL";
    throw new Error(`Missing Supabase config for heating bill: ${missing}`);
  }

  const supabase =
    useServiceRole && serviceRoleKey && supabaseUrl
      ? createClient(supabaseUrl, serviceRoleKey)
      : null;

  const mainDoc = await database
    .select()
    .from(heating_bill_documents)
    .where(eq(heating_bill_documents.id, docId))
    .then((r) => r[0] ?? null);

  const ownerUserId = mainDoc?.user_id ?? userId;

  const [invoices, user] = await Promise.all([
    database
      .select()
      .from(heating_invoices)
      .where(eq(heating_invoices.heating_doc_id, docId)),
    ownerUserId
      ? database
        .select({ first_name: users.first_name, last_name: users.last_name, id: users.id })
        .from(users)
        .where(eq(users.id, ownerUserId))
        .then((r) => r[0] ?? null)
      : Promise.resolve(null),
  ]);
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

  const objektOwner = objektResult?.user_id
    ? await database
      .select({ first_name: users.first_name, last_name: users.last_name, id: users.id })
      .from(users)
      .where(eq(users.id, objektResult.user_id))
      .then((r) => r[0] ?? null)
    : null;

  // Keep all building contracts in raw data; per-apartment selection is applied in compute.
  const localIdsForContracts = localsResult.map((l) => l.id);
  const allLocals = localsResult;
  const localIds = allLocals.map((l) => l.id);

  const [contractsResult, localMetersRows] = await Promise.all([
    localIdsForContracts.length > 0
      ? database
        .select()
        .from(contracts)
        .where(inArray(contracts.local_id, localIdsForContracts))
        .then(async (c) => {
          if (c.length === 0) return [];
          const contractIds = c.map((contract) => contract.id);
          const allContractors = await database
            .select()
            .from(contractors)
            .where(inArray(contractors.contract_id, contractIds));
          const contractorsByContract = new Map<string, typeof allContractors>();
          for (const ct of allContractors) {
            const arr = contractorsByContract.get(ct.contract_id) ?? [];
            arr.push(ct);
            contractorsByContract.set(ct.contract_id, arr);
          }
          return c.map((contract) => ({
            ...contract,
            contractors: contractorsByContract.get(contract.id) ?? [],
          }));
        })
      : [],
    localIds.length > 0
      ? database
        .select({ id: local_meters.id, meter_number: local_meters.meter_number, local_id: local_meters.local_id })
        .from(local_meters)
        .where(inArray(local_meters.local_id, localIds))
      : [],
  ]);
  const meterIds = localMetersRows.map((m) => m.id).filter(Boolean);
  const localMeters = localMetersRows.map((m) => ({
    meter_number: m.meter_number,
    local_id: m.local_id,
  }));

  let meterReadings: MeterReadingType[] = [];
  if (supabase && meterIds.length > 0 && mainDoc?.start_date && mainDoc?.end_date) {
    const RPC_TIMEOUT_MS = 8_000;
    const startDate = new Date(mainDoc.start_date);
    const endDate = new Date(mainDoc.end_date);
    startDate.setDate(startDate.getDate() - 7);
    const rpcPromise = supabase.rpc("get_dashboard_data", {
      p_local_meter_ids: meterIds,
      p_device_types: [
        "Heat",
        "Water",
        "WWater",
        "HCA",
        "Wärmemengenzähler",
        "Kaltwasserzähler",
        "Warmwasserzähler",
        "Heizkostenverteiler",
      ],
      p_start_date: startDate.toISOString().split("T")[0],
      p_end_date: endDate.toISOString().split("T")[0],
    });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase RPC timeout")), RPC_TIMEOUT_MS)
    );
    try {
      const result = await Promise.race([rpcPromise, timeoutPromise]);
      const { data: rpcData, error } = result;
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
    } catch {
      // Fall back to empty readings on timeout or RPC error (handler already does mock fallback)
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
      local_id: c.local_id,
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
    objektOwner,
    meterReadings,
    localMeters,
  };
}
