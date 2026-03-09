"use client";

import { useState } from "react";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import AddCostTypeButton from "../AddCostTypeButton";
import AdminCostTypeHeatObjektauswahlItem from "./AdminCostTypeHeatObjektauswahlItem";
import AddCostTypeInvoiceButton from "../AddCostTypeInvoiceButton";
import { useParams } from "next/navigation";

export default function AdminCostTypesHeatObjektauswahlAccordion({
	objektId,
	docId,
}: {
	objektId: string;
	docId: string;
}) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const { documentGroups } = useHeizkostenabrechnungStore();

	const params = useParams();

	const handleClick = (index: number) => {
		setOpenIndex((prev) => (prev === index ? null : index));
	};

	return (
		<div className="overflow-y-auto space-y-4">
			{documentGroups?.map((type, index) => (
				<AdminCostTypeHeatObjektauswahlItem
					isOpen={openIndex === index}
					onClick={handleClick}
					key={type.type}
					type={type}
					index={index}
					docId={docId}
					objektId={objektId}
				/>
			))}
			<AddCostTypeButton dialogType="admin_cost_type_heizkostenabrechnung_create" />
			{params.path_slug === "ai" && (
				<AddCostTypeInvoiceButton dialogType="admin_ai_invoice_create" />
			)}
		</div>
	);
}
