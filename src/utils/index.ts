import { floorShortcuts } from "@/static/formSelectOptions";
import {
  commercial,
  keys,
  multi_family,
  parking_lot,
  special_purpose,
  cost_type_water_drop,
  cost_type_pipe,
  cost_type_heater,
  cost_type_fuel_costs,
  cost_type_cleaning,
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
}: Partial<LocalType>) => {
  const floorShortcut = floor
    ? (floorShortcuts[floor as keyof typeof floorShortcuts] ?? floor)
    : "";

  const mainParts = [floorShortcut, house_location, residential_area].filter(
    Boolean
  );

  const livingSpacePart = living_space ? `, ${living_space}qm` : "";

  return mainParts.join(" ") + livingSpacePart;
};

export function getCostTypeIconByKey(key?: string) {
  switch (key) {
    case "fuel_costs":
      return cost_type_fuel_costs;
    case "operating_current":
      return cost_type_water_drop;
    case "maintenance_costs":
      return cost_type_pipe;
    case "metering_service_costs":
      return cost_type_heater;
    case "metering_device_rental":
      return cost_type_water_drop;
    case "chimney_sweep_costs":
      return cost_type_fuel_costs;
    case "other_operating_costs":
      return cost_type_cleaning;
    default:
      return cost_type_fuel_costs;
  }
}

export const formatEuro = (value: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);

export const formatDateGerman = (dateStr?: string | null) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return format(date, "dd.MM.yyyy");
};

export function generatePropertyNumber(): string {
  // 6 random digits
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function generateHeidiCustomerNumber(): string {
  // 4-digit number padded with zeros
  return String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0");
}

export function generateUserNumber(): string {
  const part1 = Math.floor(100 + Math.random() * 900);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  const part3 = Math.floor(100 + Math.random() * 900);
  return `W${part1}/${part2}/${part3}`;
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