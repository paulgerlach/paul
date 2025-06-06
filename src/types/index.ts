import type { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import { contracts, contractors, objekte, locals } from "@/db/drizzle/schema";
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

export type UploadDocumentArgs = {
  files: File[];
  relatedId: string;
  relatedType: DocumentType;
};

export type DialogActionType = "delete" | "create";

export type DocumentType = "object" | "local" | "contract" | "heating_bill";

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
