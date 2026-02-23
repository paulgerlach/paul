/**
 * Meter reading extraction & delta computation.
 * Uses closest-before-start and closest-before-end per device.
 */
import type { MeterReadingType } from "@/api";
import type { DeviceReadingRow } from "./types";
import { formatGermanNumber } from "@/utils";
import { parseGermanDate } from "@/utils";

type ReadingPoint = {
  date: Date;
  value: number;
  unit: "Wh" | "m3";
};

function parseDate(r: MeterReadingType): Date | null {
  const raw =
    r["IV,0,0,0,,Date/Time"] ??
    r["Actual Date"] ??
    r["Raw Date"] ??
    r["Billing Date"];
  if (!raw) return null;
  if (typeof raw === "string" && raw.includes(".")) {
    return parseGermanDate(raw) ?? new Date(raw);
  }
  const d = new Date(raw as string);
  return isNaN(d.getTime()) ? null : d;
}

function parseValue(r: MeterReadingType, unit: "Wh" | "m3"): number {
  if (unit === "Wh") {
    const v =
      r["IV,0,0,0,Wh,E"] ??
      r["Actual Energy / HCA"] ??
      r["Billing Value"];
    const n = typeof v === "string" ? parseFloat(v.replace(",", ".")) : Number(v);
    return isNaN(n) ? 0 : n;
  }
  const v = r["IV,0,0,0,m^3,Vol"] ?? r["Actual Volume"] ?? r["Billing Value"];
  const n = typeof v === "string" ? parseFloat(v.replace(",", ".")) : Number(v);
  return isNaN(n) ? 0 : n;
}

function getDeviceId(r: MeterReadingType): string {
  return (
    r["ID"] ??
    String(r["Number Meter"] ?? "") ??
    "unknown"
  );
}

function getDeviceType(r: MeterReadingType): string {
  const dt = r["Device Type"];
  if (dt === "Heat" || dt === "Wärmemengenzähler" || dt === "Heizkostenverteiler" || dt === "WMZ Rücklauf")
    return "Wärmezähler";
  if (dt === "WWater" || dt === "Warmwasserzähler") return "Warmwasserzähler";
  if (dt === "Water" || dt === "Kaltwasserzähler") return "Kaltwasserzähler";
  return String(dt ?? "Unbekannt");
}

export type ReadingsInput = {
  heatReadings: MeterReadingType[];
  warmWaterReadings: MeterReadingType[];
  coldWaterReadings: MeterReadingType[];
  startDate: Date;
  endDate: Date;
};

export type ReadingsResult = {
  heatDeltas: Map<string, { start: number; end: number; delta: number }>;
  warmWaterDeltas: Map<string, { start: number; end: number; delta: number }>;
  coldWaterDeltas: Map<string, { start: number; end: number; delta: number }>;
  totalHeatMwh: number;
  totalWarmWaterM3: number;
  totalColdWaterM3: number;
  totalHeatKwh: number;
  deviceRows: {
    heat: DeviceReadingRow[];
    warmWater: DeviceReadingRow[];
    coldWater: DeviceReadingRow[];
  };
};

function extractPoints(
  readings: MeterReadingType[],
  unit: "Wh" | "m3"
): { deviceId: string; deviceType: string; points: ReadingPoint[] }[] {
  const byDevice = new Map<
    string,
    { deviceType: string; points: ReadingPoint[] }
  >();
  for (const r of readings) {
    const id = getDeviceId(r);
    const date = parseDate(r);
    if (!date) continue;
    const value = parseValue(r, unit);
    const existing = byDevice.get(id);
    const deviceType = getDeviceType(r);
    const point: ReadingPoint = { date, value, unit };
    if (!existing) {
      byDevice.set(id, { deviceType, points: [point] });
    } else {
      existing.points.push(point);
    }
  }
  return Array.from(byDevice.entries()).map(([deviceId, { deviceType, points }]) => ({
    deviceId,
    deviceType,
    points: points.sort((a, b) => a.date.getTime() - b.date.getTime()),
  }));
}

function findClosestBefore(
  points: ReadingPoint[],
  target: Date
): ReadingPoint | null {
  let best: ReadingPoint | null = null;
  for (const p of points) {
    if (p.date <= target) best = p;
    else break;
  }
  return best;
}

function findClosestAtOrBefore(
  points: ReadingPoint[],
  target: Date
): ReadingPoint | null {
  return findClosestBefore(points, target);
}

function computeDeltas(
  readings: MeterReadingType[],
  unit: "Wh" | "m3",
  startDate: Date,
  endDate: Date
): Map<string, { start: number; end: number; delta: number }> {
  const result = new Map<string, { start: number; end: number; delta: number }>();
  const extracted = extractPoints(readings, unit);
  for (const { deviceId, points } of extracted) {
    const startPt = findClosestBefore(points, startDate);
    const endPt = findClosestAtOrBefore(points, endDate);
    const startVal = startPt?.value ?? 0;
    const endVal = endPt?.value ?? startVal;
    const delta = Math.max(0, endVal - startVal);
    result.set(deviceId, { start: startVal, end: endVal, delta });
  }
  return result;
}

function buildDeviceRows(
  readings: MeterReadingType[],
  unit: "Wh" | "m3",
  deltas: Map<string, { start: number; end: number; delta: number }>,
  displayUnit: string
): DeviceReadingRow[] {
  const rows: DeviceReadingRow[] = [];
  const extracted = extractPoints(readings, unit);
  for (const { deviceId, deviceType, points } of extracted) {
    const d = deltas.get(deviceId);
    if (!d) continue;
    const displayValue =
      unit === "Wh"
        ? d.delta / 1_000_000
        : d.delta;
    rows.push({
      deviceNumber: deviceId,
      deviceType,
      location: "",
      startReading: unit === "Wh" ? d.start / 1_000_000 : d.start,
      startReadingFormatted: formatGermanNumber(
        unit === "Wh" ? d.start / 1_000_000 : d.start,
        2
      ),
      endReading: unit === "Wh" ? d.end / 1_000_000 : d.end,
      endReadingFormatted: formatGermanNumber(
        unit === "Wh" ? d.end / 1_000_000 : d.end,
        2
      ),
      consumption: displayValue,
      consumptionFormatted: formatGermanNumber(displayValue, 2),
      unit: displayUnit,
    });
  }
  return rows;
}

/**
 * Compute reading deltas per device for the given period.
 */
export function computeReadingDeltas(input: ReadingsInput): ReadingsResult {
  const { heatReadings, warmWaterReadings, coldWaterReadings, startDate, endDate } = input;

  const heatDeltas = computeDeltas(heatReadings, "Wh", startDate, endDate);
  const warmWaterDeltas = computeDeltas(warmWaterReadings, "m3", startDate, endDate);
  const coldWaterDeltas = computeDeltas(coldWaterReadings, "m3", startDate, endDate);

  let totalHeatMwh = 0;
  let totalHeatKwh = 0;
  for (const [, d] of heatDeltas) {
    const mwh = d.delta / 1_000_000;
    totalHeatMwh += mwh;
    totalHeatKwh += d.delta / 1_000;
  }

  let totalWarmWaterM3 = 0;
  for (const [, d] of warmWaterDeltas) {
    totalWarmWaterM3 += d.delta;
  }

  let totalColdWaterM3 = 0;
  for (const [, d] of coldWaterDeltas) {
    totalColdWaterM3 += d.delta;
  }

  const deviceRows = {
    heat: buildDeviceRows(heatReadings, "Wh", heatDeltas, "MWh"),
    warmWater: buildDeviceRows(warmWaterReadings, "m3", warmWaterDeltas, "m³"),
    coldWater: buildDeviceRows(coldWaterReadings, "m3", coldWaterDeltas, "m³"),
  };

  return {
    heatDeltas,
    warmWaterDeltas,
    coldWaterDeltas,
    totalHeatMwh,
    totalWarmWaterM3,
    totalColdWaterM3,
    totalHeatKwh,
    deviceRows,
  };
}
