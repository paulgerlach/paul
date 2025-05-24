import type { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import { CreateObjekteUnitFormValues } from "@/components/Admin/Forms/Create/CreateObjekteUnitForm";
import { type StaticImageData } from "next/image";

export type NavGroupLink = {
  title: string;
  icon: StaticImageData;
};

export type NavGroupType = {
  title: string;
  route: string;
  groupTitle: string;
  groupLinks: NavGroupLink[];
  rightSide: React.ReactNode;
};

export type FooterLinkType = {
  url: string;
  text: string;
  isNeu?: boolean;
  isBeliebt?: boolean;
};

export type FooterLinkGroupType = {
  title: string;
  mainUrl: string;
  groupLinks: FooterLinkType[];
};

export type FunctionsSlideType = {
  title: string;
  subtitle: string;
  item: React.ReactNode;
};

export type NymberedSwiperDataItemSlideType = {
  text: string;
  title: string;
  longText: string;
};

export type NymberedSwiperDataItemType = {
  mainImage: StaticImageData;
  slides: NymberedSwiperDataItemSlideType[];
};

export type ReviewSwiperType = {
  text: string;
  name: string;
  position: string;
  video: string;
};

export type FAQItemType = {
  question: string;
  answer: string;
};

export type GeräteangebotSwiperType = {
  image: StaticImageData;
  name: string;
};

export type ChartSwiperType = {
  name: string;
  image: React.ReactNode;
  title: string;
  text: string;
};

export type StepOptionType<K extends keyof QuestionareFormData> = {
  id: string;
  value: QuestionareFormData[K];
  icon: StaticImageData;
};

export type BuildingType =
  | "special_purpose"
  | "commercial"
  | "multi_family"
  | "condominium";

export type UnitType = "residential" | "commercial" | "parking" | "warehouse";

export type LocalHistoryType = {
  id: number | string;
  start_date: string;
  end_date: string;
  last_name: string;
  first_name: string;
  price_per_month: number;
  active: boolean;
  days: number;
};

export type LocalType = CreateObjekteUnitFormValues & {
  id: number | string;
  objekt_id?: string;
  status?: "renting" | "vacancy" | "unavailable";
  name?: string;
  available?: boolean;
  type?: BuildingType;
  unit_type?: UnitType;
  history?: LocalHistoryType[];
};

export type ObjektType = {
  id: number | string;
  image?: StaticImageData;
  street: string;
  privateLocals?: number;
  commercialLocals?: number;
  percent?: number;
  message?: string;
  status?: "full" | "lower" | "higher";
  locals?: LocalType[];
};
