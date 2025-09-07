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
import { differenceInMonths, max, min, parse } from "date-fns";

export type HeatingBillPreviewProps = {
  mainDoc: HeatingBillDocumentType;
  local: LocalType;
  totalLivingSpace: number;
  contracts: (ContractType & { contractors: ContractorType[] })[];
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
  totalDiff: number;
  totalLivingSpace: number;
  contracts: (ContractType & { contractors: ContractorType[] })[];
  invoices: InvoiceDocumentType[];
  costCategories: DocCostCategoryType[];
  propertyNumber: string;
  heidiCustomerNumber: string;
};

export default function HeatingBillPreview({
  contracts,
  costCategories,
  invoices,
  local,
  mainDoc,
  objekt,
  totalLivingSpace,
  user,
}: HeatingBillPreviewProps) {
  const periodStart = parse(
    mainDoc?.start_date ? mainDoc.start_date : "",
    "dd.MM.yyyy",
    new Date()
  );
  const periodEnd = parse(
    mainDoc?.end_date ? mainDoc.end_date : "",
    "dd.MM.yyyy",
    new Date()
  );

  const filteredContracts = contracts.filter((contract) => {
    if (!contract.rental_start_date || !contract.rental_end_date) return false;
    const rentalEnd = new Date(contract.rental_end_date);
    return rentalEnd <= periodEnd;
  });

  const totalContractsAmount = filteredContracts?.reduce((acc, contract) => {
    const rentalStart = new Date(contract.rental_start_date!);
    const rentalEnd = new Date(contract.rental_end_date!);

    const overlapStart = max([rentalStart, periodStart]);
    const overlapEnd = min([rentalEnd, periodEnd]);

    let overlapMonths = differenceInMonths(overlapEnd, overlapStart) + 1;
    if (overlapMonths < 0) overlapMonths = 0;

    return acc + overlapMonths * Number(contract.additional_costs ?? 0);
  }, 0);

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total_amount ?? 0),
    0
  );

  const totalDiff =
    totalContractsAmount -
    totalAmount +
    (local?.house_fee ? Number(local?.house_fee) : 0);

  const contractors = contracts.flatMap((contract) => contract.contractors);

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
    totalInvoicesAmount: totalAmount,
    invoices,
    totalLivingSpace,
    contracts,
    totalDiff,
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
