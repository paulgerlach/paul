"use server";

import type { AdminEditObjekteUnitFormValues } from "@/components/Admin/Forms/Admin/Edit/AdminEditObjekteUnitForm";
import database from "@/db";
import { local_meters } from "@/db/drizzle/schema";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { eq, and } from "drizzle-orm";

type MeterFormData = NonNullable<AdminEditObjekteUnitFormValues["meters"]>[number];

/** Build heater_metadata jsonb for Heizkostenverteiler meters (backward compat) */
function buildHeaterMetadata(meter: MeterFormData): Record<string, unknown> | null {
  if (meter.meter_type !== "Heizkostenverteiler") return null;
  const meta: Record<string, unknown> = {};
  if (meter.old_reading != null) meta.old_reading = meter.old_reading;
  if (meter.installation_date) meta.installation_date = meter.installation_date;
  if (meter.fernfuehler) meta.fernfuehler = meter.fernfuehler;
  if (meter.radiator_type) meta.radiator_type = meter.radiator_type;
  if (meter.radiator_length != null) meta.radiator_length = meter.radiator_length;
  if (meter.radiator_width != null) meta.radiator_width = meter.radiator_width;
  if (meter.radiator_depth != null) meta.radiator_depth = meter.radiator_depth;
  if (meter.installation_factor) meta.installation_factor = meter.installation_factor;
  return Object.keys(meta).length > 0 ? meta : null;
}

/** Build device_metadata jsonb for all meter types */
function buildDeviceMetadata(meter: MeterFormData): Record<string, unknown> | null {
  const meta: Record<string, unknown> = {};
  const add = (key: string, val: unknown) => {
    if (val !== undefined && val !== null && val !== "") meta[key] = val;
  };

  switch (meter.meter_type) {
    case "Heizkostenverteiler":
      add("old_reading", meter.old_reading);
      add("installation_date", meter.installation_date);
      add("fernfuehler", meter.fernfuehler);
      add("radiator_type", meter.radiator_type);
      add("radiator_length", meter.radiator_length);
      add("radiator_width", meter.radiator_width);
      add("radiator_depth", meter.radiator_depth);
      add("installation_factor", meter.installation_factor);
      break;
    case "Gateway":
      add("installation_location", meter.installation_location);
      add("installation_date", meter.installation_date);
      add("gateway_eui", meter.gateway_eui);
      add("repeater_count", meter.repeater_count);
      add("notes", meter.notes);
      break;
    case "Repeater":
      add("installation_location", meter.installation_location);
      add("installation_date", meter.installation_date);
      add("notes", meter.notes);
      break;
    case "Warmwasserzähler":
    case "Kaltwasserzähler":
    case "Wärmemengenzähler":
    case "Kältezähler":
    case "Stromzähler":
      add("old_reading", meter.old_reading);
      add("manufacturer_old_device", meter.manufacturer_old_device);
      add("calibration_date", meter.calibration_date);
      add("notes", meter.notes);
      break;
    case "Rauchwarnmelder":
      add("calibration_date", meter.calibration_date);
      add("notes", meter.notes);
      break;
    default:
      return null;
  }

  return Object.keys(meta).length > 0 ? meta : null;
}

export async function createLocalMeters(
  formData: MeterFormData[] | null | undefined,
  localID: string
) {
  const user = await getAuthenticatedServerUser();
  if (!user) throw new Error("Nicht authentifiziert");

  const safeFormData = formData ?? [];

  // Get valid meter numbers from form data (for Gateway, gateway_eui can be used as identifier)
  const formMeterIds = safeFormData
    .map((m) =>
      m.meter_type === "Gateway" && !m.meter_number && m.gateway_eui
        ? m.gateway_eui
        : m.meter_number
    )
    .filter(Boolean) as string[];

  // Get existing meters from the database for this local
  const existingMeters = await database
    .select()
    .from(local_meters)
    .where(eq(local_meters.local_id, localID));

  // Process each meter from the form
  for (const meter of safeFormData) {
    const effectiveMeterNumber =
      meter.meter_type === "Gateway" && !meter.meter_number && meter.gateway_eui
        ? meter.gateway_eui
        : meter.meter_number;
    if (!effectiveMeterNumber) continue;

    const existingMeter = existingMeters.find(
      (m) => m.meter_number === effectiveMeterNumber
    );

    const heaterMeta = buildHeaterMetadata(meter);
    const deviceMeta = buildDeviceMetadata(meter);

    if (existingMeter) {
      // UPDATE existing meter with new values
      await database
        .update(local_meters)
        .set({
          meter_note: meter.meter_note ?? null,
          meter_type: meter.meter_type ?? null,
          heater_metadata: heaterMeta,
          device_metadata: deviceMeta,
        })
        .where(
          and(
            eq(local_meters.local_id, localID),
            eq(local_meters.meter_number, effectiveMeterNumber)
          )
        );
    } else {
      // INSERT new meter
      await database.insert(local_meters).values({
        meter_number: effectiveMeterNumber,
        meter_note: meter.meter_note ?? null,
        meter_type: meter.meter_type ?? null,
        heater_metadata: heaterMeta,
        device_metadata: deviceMeta,
        local_id: localID,
      });
    }
  }

  // Delete meters that are no longer in the form
  const metersToDelete = existingMeters.filter(
    (m) => m.meter_number && !formMeterIds.includes(m.meter_number)
  );

  for (const meter of metersToDelete) {
    await database
      .delete(local_meters)
      .where(eq(local_meters.id, meter.id));
  }

  // NOTE: We intentionally do NOT update locals.meter_ids here
  // because there's a database trigger that auto-creates local_meters
  // records when meter_ids changes, which overwrites our updates.

  // Return updated meters
  const updatedMeters = await database
    .select()
    .from(local_meters)
    .where(eq(local_meters.local_id, localID));

  return updatedMeters;
}
