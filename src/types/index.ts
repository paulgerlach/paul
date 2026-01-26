import type { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import {
  contracts,
  contractors,
  objekte,
  locals,
  invoice_documents,
  doc_cost_category,
  doc_cost_category_allocation_key,
  doc_cost_category_document_type,
  operating_cost_documents,
  heating_bill_documents,
  users,
  local_meters,
  heating_invoices,
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

export type UnitType = "residential" | "commercial" | "parking" | "warehouse" | "basement";

export type ContractType = InferInsertModel<typeof contracts>;

export type ContractorType = InferInsertModel<typeof contractors>;

export type ObjektType = InferInsertModel<typeof objekte>;
export type UserType = InferInsertModel<typeof users>;

export type LocalType = InferInsertModel<typeof locals>;
export type LocalMeterType = InferInsertModel<typeof local_meters>;

export type InvoiceDocumentType = InferInsertModel<typeof invoice_documents>;
export type HeatingInvoiceType = InferInsertModel<typeof heating_invoices>;
export type HeatingBillDocumentType = InferInsertModel<typeof heating_bill_documents>;
export type OperatingCostDocumentType = InferInsertModel<
  typeof operating_cost_documents
>;

export type DocCostCategoryType = InferInsertModel<typeof doc_cost_category>;

export const allocationKeys = doc_cost_category_allocation_key.enumValues;
export type AllocationKeyType = (typeof allocationKeys)[number];

export const documentTypes = doc_cost_category_document_type.enumValues;
export type DocumentCostType = (typeof documentTypes)[number];

export type UploadDocumentArgs = {
  files: File[];
  relatedId: string;
  relatedType: DocumentType;
};

export type DialogActionType = "delete" | "create" | "edit";

export type DocumentType =
  | "object"
  | "admin_object"
  | "local"
  | "admin_local"
  | "contract"
  | "admin_contract"
  | "heating_bill"
  | "admin_heating_bill"
  | "cost_type_betriebskostenabrechnung"
  | "cost_type_heizkostenabrechnung"
  | "admin_cost_type_betriebskostenabrechnung"
  | "admin_cost_type_heizkostenabrechnung"
  | "operating_costs"
  | "admin_operating_costs"
  | "document";

export type DialogDocumentActionType =
  | `${DocumentType}_${DialogActionType}`
  | "login"
  | "register"
  | "share_dashboard"
  | "forgotPassword"
  | "admin_objekte_image";

export type UploadedDocument = {
  id: string;
  name: string;
  url: string;
  relatedId: string;
};

export type DialogCostActionType =
  | "heizkostenabrechnung_upload"
  | "betriebskostenabrechnung_upload";

export type DialogDocumentCostActionType =
  `${DocCostCategoryType["type"]}_${DialogCostActionType}`;

export type DialogStoreActionType =
  | DialogDocumentActionType
  | DialogDocumentCostActionType
  | "shareModal"
  | "shareExtendedModal";

export type FirmwareType = 'boot' | 'modem' | 'application';
export type DeploymentType = 'scheduled' | 'available' | 'force';

export interface GatewayDesiredState {
  id: string;
  gateway_eui: string;
  desired_app_version: string | null;
  desired_boot_version: string | null;
  desired_etag: string | null;
  created_at: string;
  updated_at: string;
}

export type GatewayDesiredStateInsert = Omit<GatewayDesiredState, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type GatewayDesiredStateUpdate = Partial<Omit<GatewayDesiredState, 'id' | 'created_at' | 'updated_at'>> & {
  updated_at?: string;
};

export interface ConfigVersion {
  id: string;
  etag: string;
  config: any;
  description: string | null;
  created_by: string | null;
  created_at: string;
  is_active: boolean;
}

export type ConfigVersionInsert = Omit<ConfigVersion, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type ConfigVersionUpdate = Partial<Omit<ConfigVersion, 'id' | 'created_at' | 'etag'>>;

export interface FirmwareVersion {
  id: string;
  filename: string;
  original_filename: string;
  version: string;
  type: FirmwareType;
  device_model: string;
  size_bytes: number;
  checksum_sha256: string;
  total_chunks: number;
  chunk_size: number;
  description: string | null;
  release_notes: string | null;
  min_version: string | null;
  max_version: string | null;
  deployment_type: DeploymentType;
  allowed_gateways: any[];
  is_active: boolean;
  uploaded_by: string | null;
  uploaded_at: string | null;
  created_at: string;
}

export type FirmwareVersionInsert = Omit<FirmwareVersion, 'id' | 'created_at' | 'uploaded_at'> & {
  id?: string;
  uploaded_at?: string;
  created_at?: string;
};

export type FirmwareVersionUpdate = Partial<Omit<FirmwareVersion, 'id' | 'created_at' | 'uploaded_at' | 'filename'>>;
export interface FirmwareWithDownloadUrl extends FirmwareVersion {
  download_url?: string;
  signed_url?: string;
}