import type { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import {
  contracts,
  contractors,
  objekte,
  locals,
  heating_bill_documents,
} from "@/db/drizzle/schema";
import { type InferInsertModel } from "drizzle-orm";
import { type StaticImageData } from "next/image";

export type NavGroupLink = {
  title: string;
  icon: StaticImageData;
  link?: string;
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

export type ContractType = InferInsertModel<typeof contracts>;

export type ContractorType = InferInsertModel<typeof contractors>;

export type ObjektType = InferInsertModel<typeof objekte>;

export type LocalType = InferInsertModel<typeof locals>;

export type HeatingBillDocumentType = InferInsertModel<
  typeof heating_bill_documents
>;

export type UploadDocumentArgs = {
  files: File[];
  relatedId: string;
  relatedType: DocumentType;
};

export type DialogActionType = "delete" | "create";

export type DocumentType = "object" | "local" | "contract" | "heating_bill" | "operating_costs";

export type DialogDocumentActionType =
  | `${DocumentType}_${DialogActionType}`
  | "login"
  | "register";

export type UploadedDocument = {
  id: string;
  name: string;
  url: string;
  relatedId: string;
};

export type CostTypeKey =
  | "fuel_costs"
  | "operating_current"
  | "maintenance_costs"
  | "metering_service_costs"
  | "metering_device_rental"
  | "chimney_sweep_costs"
  | "other_operating_costs"
  | "property_tax"
  | "cold_water"
  | "wastewater"
  | "heating_costs"
  | "hot_water_supply"
  | "caretaker"
  | "liability_insurance"
  | "waste_disposal"
  | "elevator"
  | "street_cleaning"
  | "building_cleaning"
  | "garden_care"
  | "lighting";

export type DialogCostActionType = "upload";

export type DialogDocumentCostActionType =
  `${CostTypeKey}_${DialogCostActionType}`;

export type DialogStoreActionType =
  | DialogDocumentActionType
  | DialogDocumentCostActionType;

export type CostType = {
  key: CostTypeKey;
  options?: string[];
};
