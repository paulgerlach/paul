/**
 * Server-side compatible version of HeidiSystemsPdf
 * This file does NOT have "use client" directive, enabling server-side rendering with renderToBuffer
 */
import { Document } from "@react-pdf/renderer";
import HeatingBillPreviewFivePDF from "./HeatingBillPreviewFivePDF";
import HeatingBillPreviewOnePDF from "./HeatingBillPreviewOnePDF";
import HeatingBillPreviewTwoPDF from "./HeatingBillPreviewTwoPDF";
import HeatingBillPreviewThreePDF from "./HeatingBillPreviewThreePDF";
import HeatingBillPreviewFourPDF from "./HeatingBillPreviewFourPDF";
import HeatingBillPreviewSixPDF from "./HeatingBillPreviewSixPDF";
import {
	type HeatingBillPreviewData,
	type HeatingBillPreviewProps,
} from "../HeatingBillPreview/HeatingBillPreview";
import { generateHeidiCustomerNumber, generatePropertyNumber } from "@/utils";
import { differenceInMonths, max, min } from "date-fns";

/**
 * Server-side PDF document component.
 * Used with @react-pdf/renderer's renderToBuffer for server-side PDF generation.
 */
export default function HeidiSystemsPdfServer(props: HeatingBillPreviewProps) {
	const { generalInfo, contracts, billingInvoices, logoSrc } = props;

	const periodStart = generalInfo.billingStartDate
		? new Date(generalInfo.billingStartDate)
		: new Date();
	const periodEnd = generalInfo.billingEndDate
		? new Date(generalInfo.billingEndDate)
		: new Date();

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

	const totalAmount =
		billingInvoices.fuelTotal +
		billingInvoices.heatingTotal +
		billingInvoices.operationalTotal;

	const totalDiff = totalContractsAmount - totalAmount;

	const contractors = contracts.flatMap((contract) => contract.contractors);

	const previewData: HeatingBillPreviewData = {
		generalInfo,
		contractorsNames: contractors
			?.map((c) => `${c.first_name} ${c.last_name}`)
			.join(", "),
		totalInvoicesAmount: totalAmount,
		contracts,
		totalDiff,
		billingInvoices,
		propertyNumber: generatePropertyNumber(),
		heidiCustomerNumber: generateHeidiCustomerNumber(),
		logoSrc,
		consumptionData: props.consumptionData,
		hotWaterHeatingAllocation: props.hotWaterHeatingAllocation,
	};

	return (
		<Document>
			<HeatingBillPreviewOnePDF
				previewData={previewData}
				contractors={contractors}
			/>
			<HeatingBillPreviewTwoPDF previewData={previewData} />
			<HeatingBillPreviewThreePDF previewData={previewData} />
			<HeatingBillPreviewFourPDF previewData={previewData} />
			<HeatingBillPreviewFivePDF previewData={previewData} />
			<HeatingBillPreviewSixPDF previewData={previewData} />
		</Document>
	);
}
