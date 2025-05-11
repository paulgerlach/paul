import type { QuestionareFormData } from "@/app/(service)/fragebogen/page";
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

export type ObjektType = {
  image: StaticImageData;
  street: string;
  privateLocals?: number;
  commercialLocals?: number;
  percent: number;
  message: string;
  status: "full" | "lower" | "higher";
};
