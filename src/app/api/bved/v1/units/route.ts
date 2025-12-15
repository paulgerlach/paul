import { NextResponse } from "next/server";
import database from "@/db";
import {
  locals,
  objekte,
  contracts,
  contractors,
} from "@/db/drizzle/schema";
import { eq, inArray } from "drizzle-orm";
import { requireExternalAuth, formatError } from "../_lib/auth";

export async function GET(request: Request) {
  try {
    await requireExternalAuth(request);

    const unitRows = await database
      .select({
        id: locals.id,
        objekt_id: locals.objekt_id,
        usage_type: locals.usage_type,
        floor: locals.floor,
        living_space: locals.living_space,
        house_location: locals.house_location,
        rooms: locals.rooms,
        tags: locals.tags,
        heating_systems: locals.heating_systems,
        created_at: locals.created_at,
        property_type: objekte.objekt_type,
        property_street: objekte.street,
        property_zip: objekte.zip,
      })
      .from(locals)
      .leftJoin(objekte, eq(locals.objekt_id, objekte.id));

    const localIds = unitRows.map((u) => u.id);
    let contractRows: typeof contracts.$inferSelect[] = [];
    let contractorRows: typeof contractors.$inferSelect[] = [];

    if (localIds.length > 0) {
      contractRows = await database
        .select()
        .from(contracts)
        .where(inArray(contracts.local_id, localIds));

      const contractIds = contractRows.map((c) => c.id);
      if (contractIds.length > 0) {
        contractorRows = await database
          .select()
          .from(contractors)
          .where(inArray(contractors.contract_id, contractIds));
      }
    }

    const contractorsByContract: Record<string, typeof contractorRows> = {};
    for (const ct of contractorRows) {
      contractorsByContract[ct.contract_id] = [
        ...(contractorsByContract[ct.contract_id] || []),
        ct,
      ];
    }

    const contractsByLocal: Record<string, any[]> = {};
    for (const c of contractRows) {
      contractsByLocal[c.local_id] = [
        ...(contractsByLocal[c.local_id] || []),
        {
          ...c,
          tenants: contractorsByContract[c.id] || [],
        },
      ];
    }

    const response = unitRows.map((unit) => ({
      unit: {
        id: unit.id,
        usage_type: unit.usage_type,
        floor: unit.floor,
        living_space: unit.living_space,
        house_location: unit.house_location,
        rooms: unit.rooms,
        tags: unit.tags,
        heating_systems: unit.heating_systems,
        created_at: unit.created_at,
      },
      property: {
        id: unit.objekt_id,
        type: unit.property_type,
        street: unit.property_street,
        zip: unit.property_zip,
      },
      contracts: contractsByLocal[unit.id] || [],
    }));

    return NextResponse.json({ units: response });
  } catch (error) {
    return formatError(error);
  }
}


