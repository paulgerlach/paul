import {
  commercial,
  keys,
  multi_family,
  special_purpose,
  trend_check,
  trend_down,
  trend_up,
} from "@/static/icons";
import { BuildingType, ObjektType } from "@/types";
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

export const handleLocalTypeIcon = (type: BuildingType): StaticImageData => {
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

export const renderTradeIcon = (tradeStatus: ObjektType["status"]) => {
  switch (tradeStatus) {
    case "full":
      return trend_check;
    case "higher":
      return trend_up;
    case "lower":
      return trend_down;
  }
};
export const renderTradeColor = (tradeStatus: ObjektType["status"]) => {
  switch (tradeStatus) {
    case "full":
      return "#8AD68F";
    case "higher":
      return "#8AD68F";
    case "lower":
      return "#E08E3A";
  }
};
