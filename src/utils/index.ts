import { floorShortcuts } from "@/static/formSelectOptions";
import {
  commercial,
  keys,
  parking_lot,
  special_purpose,
  basement,
  staircase,
  multi_family,
  cost_type_water_drop,
  cost_type_pipe,
  cost_type_heater,
  cost_type_fuel_costs,
  cost_type_cleaning,
  cost_type_fuel_costs_direct,
  cost_type_operating_current,
  cost_type_maintenance_costs,
  cost_type_metering_service_costs,
  cost_type_metering_device_rental,
  cost_type_chimney_sweep_costs,
  cost_type_other_operating_costs,
} from "@/static/icons";
import type { BuildingType, LocalType, UnitType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { type StaticImageData } from "next/image";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const slideUp = (target: HTMLElement | null, duration = 300) => {
  if (!target) return;

  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.boxSizing = "border-box";
  target.style.height = target.offsetHeight + "px";
  target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = "0";
  target.style.paddingTop = "0";
  target.style.paddingBottom = "0";
  target.style.marginTop = "0";
  target.style.marginBottom = "0";
  target.style.border = "none";

  window.setTimeout(() => {
    target.style.display = "none";
    target.style.removeProperty("height");
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
    target.style.removeProperty("border");
  }, duration);
};

export const slideDown = (target: HTMLElement | null, duration = 300) => {
  if (!target) return;

  target.style.removeProperty("display");
  let display = window.getComputedStyle(target).display;
  if (display === "none") display = "grid";
  target.style.display = display;
  const height = target.offsetHeight;
  target.style.overflow = "hidden";
  target.style.height = "0";
  target.style.paddingTop = "0";
  target.style.paddingBottom = "0";
  target.style.marginTop = "0";
  target.style.marginBottom = "0";
  target.offsetHeight;
  target.style.boxSizing = "border-box";
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + "ms";
  target.style.height = height + "px";
  target.style.border = "none";

  target.style.removeProperty("padding-top");
  target.style.removeProperty("padding-bottom");
  target.style.removeProperty("margin-top");
  target.style.removeProperty("margin-bottom");
  target.style.removeProperty("border");

  window.setTimeout(() => {
    target.style.removeProperty("height");
    target.style.removeProperty("overflow");
    target.style.removeProperty("transition-duration");
    target.style.removeProperty("transition-property");
    target.style.removeProperty("border");
  }, duration);
};

export function formatDate(input?: string): string {
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  if (!input) return "";

  const [year, month, day] = input.split("-");
  const monthName = months[parseInt(month, 10) - 1];

  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

export const handleObjektTypeIcon = (
  type?: BuildingType
): StaticImageData | undefined => {
  switch (type) {
    case "commercial":
      return commercial;
    case "condominium":
      return keys;
    case "multi_family":
      return multi_family;
    case "special_purpose":
      return special_purpose;
  }
};

export const handleLocalTypeIcon = (
  type?: UnitType
): StaticImageData | undefined => {
  switch (type) {
    case "commercial":
      return commercial;
    case "residential":
      return keys;
    case "parking":
      return parking_lot;
    case "warehouse":
      return special_purpose;
    case "basement":
      return basement;
    case "hallway":
      return staircase;
  }
};

export const countLocals = (locals: LocalType[]) => {
  const commertialLocals = locals.filter(
    (local) => local.usage_type === "commercial"
  );

  const otherLocals = locals.filter(
    (local) =>
      local.usage_type !== "commercial" && local.usage_type !== "parking"
  );

  return { commertialLocals, otherLocals };
};

export const buildLocalName = ({
  floor,
  house_location,
  residential_area,
  living_space,
  heating_area,
}: Partial<LocalType>) => {
  const floorShortcut = floor
    ? (floorShortcuts[floor as keyof typeof floorShortcuts] ?? floor)
    : "";

  const mainParts = [floorShortcut, house_location, residential_area].filter(
    Boolean
  );

  const livingSpacePart = living_space ? `, ${living_space}qm` : "";
  const heatingSpacePart = heating_area ? `, HF: ${heating_area}qm` : "";

  return mainParts.join(" ") + livingSpacePart + heatingSpacePart;
};

export const FUEL_COST_TYPES = ["fuel_costs", "brennstoffkosten"] as const;
export const isFuelCostType = (type?: string | null): boolean =>
  FUEL_COST_TYPES.includes(type as (typeof FUEL_COST_TYPES)[number]);

export function getCostTypeIconByKey(key?: string) {
  switch (key) {
    case "fuel_costs":
    case "brennstoffkosten":
      return cost_type_fuel_costs_direct;
    case "operating_current":
    case "betriebsstrom":
      return cost_type_operating_current;
    case "maintenance_costs":
    case "wartungskosten":
      return cost_type_maintenance_costs;
    case "metering_service_costs":
    case "messdienstkosten":
      return cost_type_metering_service_costs;
    case "metering_device_rental":
    case "miete_der_messgeraete":
      return cost_type_metering_device_rental;
    case "chimney_sweep_costs":
    case "schornsteinfegerkosten":
      return cost_type_chimney_sweep_costs;
    case "other_operating_costs":
    case "sonstige_betriebskosten":
      return cost_type_other_operating_costs;
    default:
      return cost_type_fuel_costs;
  }
}

export const formatEuro = (value: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);

/** German number formatting without currency. Used for rates, kWh, m³, etc. */
export const formatGermanNumber = (value: number, decimals = 2) =>
  new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

export const formatDateGerman = (dateStr?: string | null) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return format(date, "dd.MM.yyyy");
};

/** Simple hash of string to positive integer (for deterministic IDs) */
function hashToNum(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h = h & 0x7fffffff;
  }
  return h;
}

export function generatePropertyNumber(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Deterministic property number from objekt id */
export function propertyNumberFromObjekt(objektId: string): string {
  const n = hashToNum(objektId);
  return String(100000 + (n % 900000)).slice(0, 6);
}

export function generateHeidiCustomerNumber(): string {
  return String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");
}

/** Deterministic heidi customer number from user id */
export function heidiCustomerNumberFromUser(userId: string): string {
  const n = hashToNum(userId);
  return String((n % 9999) + 1).padStart(4, "0");
}

export function generateUserNumber(): string {
  const part1 = Math.floor(100 + Math.random() * 900);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  const part3 = Math.floor(100 + Math.random() * 900);
  return `W${part1}/${part2}/${part3}`;
}

/** Deterministic user number from user + local + doc ids */
export function userNumberFromIds(
  userId: string,
  localId: string,
  docId: string
): string {
  const p1 = 100 + (hashToNum(userId) % 900);
  const p2 = 1000 + (hashToNum(localId) % 9000);
  const p3 = 100 + (hashToNum(docId) % 900);
  return `W${p1}/${p2}/${p3}`;
}

const ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Deterministic security code from user + doc ids (alphanumeric, 10 chars) */
export function securityCodeFromIds(userId: string, docId: string): string {
  const h = hashToNum(userId + docId);
  let code = "";
  let n = h;
  for (let i = 0; i < 10; i++) {
    n = (n * 1103515245 + 12345) & 0x7fffffff;
    code += ALPHANUM[n % ALPHANUM.length];
  }
  return code;
}

// Helper function to parse German date format (DD.MM.YYYY)
export const parseGermanDate = (dateString: string): Date | null => {
  if (!dateString) return null;

  // Handle DD.MM.YYYY format
  const parts = dateString.split(".");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  // Fallback to standard parsing
  return new Date(dateString);
};

// Re-export CO₂ calculation utilities
export {
  calculateCO2Savings,
  formatCO2Savings,
  getCO2Context,
  CO2_EMISSION_FACTORS,
  ENERGY_CONVERSION,
  type CO2CalculationResult,
} from './co2Calculator';