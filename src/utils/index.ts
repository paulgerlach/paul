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
import type { BuildingType, CostTypeKey, LocalType, UnitType } from "@/types";
import { clsx, type ClassValue } from "clsx";
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
    case "warehouse":
      return keys;
    case "parking":
      return parking_lot;
    case "residential":
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

export function getCostTypeNameByKey(key: CostTypeKey) {
  switch (key) {
    case "fuel_costs":
      return "Brennstoffkosten";
    case "operating_current":
      return "Betriebsstrom";
    case "maintenance_costs":
      return "Wartungskosten";
    case "metering_service_costs":
      return "Messdienstkosten";
    case "metering_device_rental":
      return "Miete der Messgeräte";
    case "chimney_sweep_costs":
      return "Schornsteinfegerkosten";
    case "other_operating_costs":
      return "Sonstige Betriebskosten";

    case "property_tax":
      return "Grundsteuer";
    case "cold_water":
      return "Kaltwasser (Wasserversorgung)";
    case "wastewater":
      return "Entwässerung (Abwasser)";
    case "heating_costs":
      return "Heizkosten";
    case "hot_water_supply":
      return "Warmwasserversorgung";
    case "caretaker":
      return "Hausmeister";
    case "liability_insurance":
      return "Sach- & Haftpflichtversicherung";
    case "waste_disposal":
      return "Müllabfuhr";
    case "elevator":
      return "Aufzüge";
    case "street_cleaning":
      return "Straßenreinigung";
    case "building_cleaning":
      return "Gebäudereinigung";
    case "garden_care":
      return "Gartenpflege";
    case "lighting":
      return "Beleuchtung (Gemeinschaftsflächen, z. B. Treppenhaus)";
  }
}

export function getCostTypeIconByKey(key: CostTypeKey) {
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
  }
}
