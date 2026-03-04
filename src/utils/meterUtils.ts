/**
 * Utility functions for meter operations
 */

import type { LocalMeterType } from "@/types";

/** Map a database meter to form initial values, reading from device_metadata (fallback heater_metadata for HCA) */
export function mapMeterToFormValues(meter: LocalMeterType) {
  const heaterMeta = (meter.heater_metadata ?? {}) as Record<string, unknown>;
  const deviceMeta = (meter.device_metadata ?? {}) as Record<string, unknown>;
  const meta =
    meter.meter_type === "Heizkostenverteiler"
      ? { ...heaterMeta, ...deviceMeta }
      : deviceMeta;

  const get = <T>(key: string): T | null =>
    (meta[key] as T | undefined) ?? null;

  return {
    meter_note: meter.meter_note ?? null,
    meter_number: meter.meter_number ?? null,
    meter_type: meter.meter_type ?? null,
    old_reading: get<number>("old_reading"),
    installation_date: get<string>("installation_date"),
    radiator_type: get<string>("radiator_type"),
    radiator_length: get<number>("radiator_length"),
    radiator_width: get<number>("radiator_width"),
    radiator_depth: get<number>("radiator_depth"),
    installation_factor: get<string>("installation_factor"),
    fernfuehler: get<string>("fernfuehler"),
    installation_location: get<string>("installation_location"),
    gateway_eui: get<string>("gateway_eui"),
    repeater_count: get<string>("repeater_count"),
    notes: get<string>("notes"),
    manufacturer_old_device: get<string>("manufacturer_old_device"),
    calibration_date: get<string>("calibration_date"),
  };
}

export const fetchMeterUUIDs = async (localIds: string[]): Promise<string[]> => {
  if (!localIds.length) return [];
  
  try {
    const response = await fetch("/api/meters-by-locals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ localIds }),
    });

    if (response.ok) {
      const { meters } = await response.json();
      return meters
        .map((meter: any) => meter.id)
        .filter((id: string) => Boolean(id));
    }
    return [];
  } catch (error) {
    console.error("Error fetching meter IDs:", error);
    return [];
  }
};

export const fetchSingleLocalMeterUUIDs = async (localId: string): Promise<string[]> => {
  return fetchMeterUUIDs([localId]);
};