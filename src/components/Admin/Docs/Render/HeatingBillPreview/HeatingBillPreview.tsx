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

// ... imports

export type HeatingBillGeneralInfo = {
	billingStartDate: string | null;
	billingEndDate: string | null;
	street: string | null;
	zip: string | null;
	consumptionDependent: string | null;
	livingSpaceShare: string | null;
	ownerFirstName: string | null;
	ownerLastName: string | null;
	documentCreationDate: string | null;
	totalLivingSpace: number;
	apartmentCount: number;
};

export type HeatingBillPreviewProps = {
	generalInfo: HeatingBillGeneralInfo;
	contracts: (ContractType & { contractors: ContractorType[] })[];
	costCategories: DocCostCategoryType[];
	invoices: InvoiceDocumentType[];
	logoSrc?: string; // Optional logo source (file path or data URL)
	// Iteration 2: Energy consumption calculations
	energyConsumption?: EnergyConsumptionData; // Calculated server-side

	heatRelatedCosts?: AdditionalCostsData;
	otherOperatingCosts?: AdditionalCostsData;
	// Iteration 3: Additional costs and grand total
	additionalCosts?: AdditionalCostsData;
	totalHeatingCosts?: number;
};

/**
 * Energy consumption line item for display in PDF
 */
export type EnergyConsumptionLineItem = {
	position: string; // e.g., "Rechnung 260002673166" or "Preisbremse Energie"
	date?: string; // Invoice date
	kwh?: string; // Energy consumption in kWh (if applicable)
	amount: number; // Amount in EUR
};

/**
 * Aggregated energy consumption data for PDF display
 */
export type EnergyConsumptionData = {
	energyType: string; // e.g., "Nah-/Fernwärme kWh"
	lineItems: EnergyConsumptionLineItem[];
	totalKwh: string; // Sum of kWh
	totalAmount: number; // Sum of amounts (Summe Verbrauch)
};

export type AdditionalCostLineItem = {
	position: string;
	date?: string;
	amount: number;
	costType?: string;
};

export type AdditionalCostsData = {
	lineItems: AdditionalCostLineItem[];
	totalAmount: number;
};

export type HeatingBillPreviewData = {
	generalInfo: HeatingBillGeneralInfo;
	contractorsNames: string;
	totalInvoicesAmount: number;
	totalDiff: number;
	contracts: (ContractType & { contractors: ContractorType[] })[];
	invoices: InvoiceDocumentType[];
	costCategories: DocCostCategoryType[];
	propertyNumber: string;
	heidiCustomerNumber: string;
	logoSrc?: string; // Optional logo source (file path or data URL)
	// Iteration 2: Energy consumption calculations
	energyConsumption?: EnergyConsumptionData;

	// Iteration 3: Additional costs and grand total
	additionalCosts?: AdditionalCostsData;
	heatRelatedCosts?: AdditionalCostsData;
	otherOperatingCosts?: AdditionalCostsData;
	totalHeatingCosts?: number; // Summe Energie- und Heizungsbetriebskosten
};

export default function HeatingBillPreview({
	contracts,
	costCategories,
	heatRelatedCosts,
	invoices,
	generalInfo,
}: HeatingBillPreviewProps) {
	const periodStart = generalInfo.billingStartDate
		? new Date(generalInfo.billingStartDate)
		: new Date();
	const periodEnd = generalInfo.billingEndDate
		? new Date(generalInfo.billingEndDate)
		: new Date();

	// ... rest of function using generalInfo instead of mainDoc/objekt/user

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
		0,
	);

	const totalDiff = totalContractsAmount - totalAmount;

	const contractors = contracts.flatMap((contract) => contract.contractors);

	const previewData: HeatingBillPreviewData = {
		generalInfo,
		contractorsNames: contractors
			?.map((c) => `${c.first_name} ${c.last_name}`)
			.join(", "),
		totalInvoicesAmount: totalAmount,
		invoices,
		costCategories,
		contracts,
		totalDiff,
		heatRelatedCosts,
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
