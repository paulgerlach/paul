import type { HeatingBillPdfModel } from "./types";
import { mockHeatingBillModel } from "./mock-model";
import type {
  HeatingBillPreviewData,
  HeatingBillPreviewProps,
} from "@/components/Admin/Docs/Render/HeatingBillPreview/HeatingBillPreview";
import type { ContractorType } from "@/types";
import {
  formatDateGerman,
  formatEuro,
  generatePropertyNumber,
  generateHeidiCustomerNumber,
  generateUserNumber,
} from "@/utils";
import { differenceInMonths, max, min } from "date-fns";

/**
 * Build HeatingBillPreviewData from HeatingBillPreviewProps.
 * Duplicates logic from HeatingBillPreview to avoid circular deps.
 */
function buildPreviewData(props: HeatingBillPreviewProps): {
  previewData: HeatingBillPreviewData;
  contractors: ContractorType[];
} {
  const { mainDoc, contracts, invoices, objekt, user } = props;
  const periodStart = mainDoc?.start_date
    ? new Date(mainDoc.start_date)
    : new Date();
  const periodEnd = mainDoc?.end_date ? new Date(mainDoc.end_date) : new Date();

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

  const totalDiff = totalContractsAmount - totalAmount;
  const contractors = contracts.flatMap((contract) => contract.contractors);

  const previewData: HeatingBillPreviewData = {
    mainDocDates: {
      created_at: mainDoc?.created_at,
      start_date: mainDoc?.start_date,
      end_date: mainDoc?.end_date,
    },
    mainDocData: mainDoc,
    userInfo: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
    },
    objektInfo: {
      zip: objekt?.zip ?? "",
      street: objekt?.street ?? "",
    },
    contractorsNames: contractors
      ?.map((c) => `${c.first_name} ${c.last_name}`)
      .join(", ") ?? "",
    totalInvoicesAmount: totalAmount,
    totalLivingSpace: props.totalLivingSpace,
    contracts: props.contracts,
    invoices: props.invoices,
    costCategories: props.costCategories,
    totalDiff,
    propertyNumber: generatePropertyNumber(),
    heidiCustomerNumber: generateHeidiCustomerNumber(),
  };

  return { previewData, contractors };
}

/**
 * Converts HeatingBillPreviewProps (from client) to HeatingBillPdfModel.
 * Used by LocalPDFDownloadButton until Step 7 migrates to API.
 */
export function previewPropsToModel(
  props: HeatingBillPreviewProps
): HeatingBillPdfModel {
  const { previewData, contractors } = buildPreviewData(props);
  const model = JSON.parse(
    JSON.stringify(mockHeatingBillModel)
  ) as HeatingBillPdfModel;

  const propertyNumber = previewData.propertyNumber;
  const heidiCustomerNumber = previewData.heidiCustomerNumber;

  model.cover = {
    ...model.cover,
    propertyNumber,
    heidiCustomerNumber,
    userNumber: generateUserNumber(),
    contractorsNames: previewData.contractorsNames || model.cover.contractorsNames,
    street: previewData.objektInfo?.street || model.cover.street,
    zip: previewData.objektInfo?.zip || model.cover.zip,
    ownerFirstName: previewData.userInfo?.first_name || model.cover.ownerFirstName,
    ownerLastName: previewData.userInfo?.last_name || model.cover.ownerLastName,
    createdAt: formatDateGerman(previewData.mainDocDates?.created_at) || model.cover.createdAt,
    billingPeriodStart:
      formatDateGerman(previewData.mainDocDates?.start_date) ||
      model.cover.billingPeriodStart,
    billingPeriodEnd:
      formatDateGerman(previewData.mainDocDates?.end_date) ||
      model.cover.billingPeriodEnd,
    usagePeriodStart:
      formatDateGerman(previewData.mainDocDates?.start_date) ||
      model.cover.usagePeriodStart,
    usagePeriodEnd:
      formatDateGerman(previewData.mainDocDates?.end_date) ||
      model.cover.usagePeriodEnd,
    totalAmount: previewData.totalDiff ?? model.cover.totalAmount,
    totalAmountFormatted: formatEuro(
      previewData.totalDiff ?? model.cover.totalAmount
    ),
    contractors:
      contractors.length > 0
        ? contractors
            .filter((c): c is typeof c & { id: string } => Boolean(c.id))
            .map((c) => ({
              id: c.id,
              firstName: c.first_name,
              lastName: c.last_name,
            }))
        : undefined,
  };

  model.unitBreakdown = {
    ...model.unitBreakdown,
    contractorsNames:
      previewData.contractorsNames || model.unitBreakdown.contractorsNames,
    street: previewData.objektInfo?.street || model.unitBreakdown.street,
    zip: previewData.objektInfo?.zip || model.unitBreakdown.zip,
    billingPeriodStart:
      formatDateGerman(previewData.mainDocDates?.start_date) ||
      model.unitBreakdown.billingPeriodStart,
    billingPeriodEnd:
      formatDateGerman(previewData.mainDocDates?.end_date) ||
      model.unitBreakdown.billingPeriodEnd,
    createdAt:
      formatDateGerman(previewData.mainDocDates?.created_at) ||
      model.unitBreakdown.createdAt,
    grandTotal: previewData.totalDiff ?? model.unitBreakdown.grandTotal,
    grandTotalFormatted: formatEuro(
      previewData.totalDiff ?? model.unitBreakdown.grandTotal
    ),
  };

  return model;
}
