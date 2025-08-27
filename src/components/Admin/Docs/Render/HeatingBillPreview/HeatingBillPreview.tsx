import HeatingBillPreviewOne from "@/components/Admin/Docs/Render/HeatingBillPreview/HeatingBillPreviewOne";
import HeatingBillPreviewTwo from "./HeatingBillPreviewTwo";
import HeatingBillPreviewThree from "./HeatingBillPreviewThree";
import HeatingBillPreviewFour from "./HeatingBillPreviewFour";
import HeatingBillPreviewFive from "./HeatingBillPreviewFive";
import HeatingBillPreviewSix from "./HeatingBillPreviewSix";
import type {
  ContractorType,
  ContractType,
  DocCostCategoryType,
  HeatingBillDocumentType,
  InvoiceDocumentType,
  LocalType,
  ObjektType,
  UserType,
} from "@/types";
import { generateHeidiCustomerNumber, generatePropertyNumber } from "@/utils";

export type HeatingBillPreviewProps = {
  mainDoc: HeatingBillDocumentType;
  local: LocalType;
  totalLivingSpace: number;
  contract: ContractType;
  contractors: ContractorType[];
  costCategories: DocCostCategoryType[];
  invoices: InvoiceDocumentType[];
  objekt: ObjektType;
  user: UserType;
};

export type HeatingBillPreviewData = {
  mainDocDates: {
    created_at?: string;
    start_date?: string | null;
    end_date?: string | null;
  };
  mainDocData: HeatingBillDocumentType;
  userInfo: {
    first_name: string;
    last_name: string;
  };
  objektInfo: {
    zip: string;
    street: string;
  };
  contractorsNames: string;
  totalInvoicesAmount: number;
  totalLivingSpace: number;
  contract: ContractType;
  costCategories: DocCostCategoryType[];
  propertyNumber: string;
  heidiCustomerNumber: string;
};

export default function HeatingBillPreview({
  contract,
  contractors,
  costCategories,
  invoices,
  local,
  mainDoc,
  objekt,
  totalLivingSpace,
  user,
}: HeatingBillPreviewProps) {
  const previewData: HeatingBillPreviewData = {
    mainDocDates: {
      created_at: mainDoc?.created_at,
      start_date: mainDoc?.start_date,
      end_date: mainDoc?.end_date,
    },
    mainDocData: mainDoc,
    userInfo: {
      first_name: user?.first_name,
      last_name: user?.last_name,
    },
    objektInfo: {
      zip: objekt?.zip,
      street: objekt?.street,
    },
    contractorsNames: contractors
      ?.map((c) => `${c.first_name} ${c.last_name}`)
      .join(", "),
    totalInvoicesAmount: invoices.reduce(
      (sum, invoice) => sum + Number(invoice.total_amount ?? 0),
      0
    ),
    totalLivingSpace,
    contract,
    costCategories,
    propertyNumber: generatePropertyNumber(),
    heidiCustomerNumber: generateHeidiCustomerNumber(),
  };

  return (
    <div className="py-[60px] space-y-[60px] px-[100px] bg-white">
      <HeatingBillPreviewOne
        contractors={contractors}
        previewData={previewData}
      />
      <HeatingBillPreviewTwo previewData={previewData} />
      <HeatingBillPreviewThree previewData={previewData} />
      <HeatingBillPreviewFour previewData={previewData} />
      <HeatingBillPreviewFive previewData={previewData} />
      <HeatingBillPreviewSix previewData={previewData} />
    </div>
  );
}
