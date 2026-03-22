"use client";

import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import type {
	DocCostCategoryType,
	InvoiceDocumentType,
	LocalType,
} from "@/types";
import { useForm } from "react-hook-form";
import { Form } from "@/components/Basic/ui/Form";
import { UploadDropzone } from "./components/UploadDropzone";
import { FileList } from "./components/FileList";
import { FormFooter } from "./components/FormFooter";
import { useDokumentenManagement } from "@/hooks/useDokumentenManagement";
import { UploadInfoItems } from "./components/UploadInfoItems";

export default function DokumentenmanagementForm({
	objektId,
	docId,
	pathSlug,
	userDocCostCategories,
	relatedInvoices,
	locals,
}: {
	objektId: string;
	docId: string;
	pathSlug: string;
	userDocCostCategories: DocCostCategoryType[];
	relatedInvoices?: InvoiceDocumentType[];
	locals: LocalType[];
}) {
	const methods = useForm();
	const {
		entries,
		step,
		onDrop,
		onDropRejected,
		handleSubmit,
		submitMutation,
		isSubmitDisabled,
	} = useDokumentenManagement({
		objektId,
		docId,
		pathSlug,
		userDocCostCategories,
		relatedInvoices,
		locals,
	});
	const isEditMode = !!relatedInvoices;

	const backLink = isEditMode
		? `${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/weitermachen/${docId}/abrechnungszeitraum`
		: `${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/abrechnungszeitraum`;

	return (
		<div className="bg-[#EFEEEC] border-y-[20px] border-[#EFEEEC] col-span-3 h-full rounded-2xl px-4 flex items-start justify-center max-w-6xl">
			<div className="bg-white h-full py-6 px-4 rounded w-full shadow-sm space-y-8 flex flex-col overflow-y-auto">
				<h2 className="font-bold">Dokumente hochladen</h2>

				<UploadInfoItems />

				<Form {...methods}>
					<form
						className="flex-1 flex flex-col"
						onSubmit={methods.handleSubmit(handleSubmit)}
					>
						<UploadDropzone onDrop={onDrop} onDropRejected={onDropRejected} />

						<FileList entries={entries} />

						<FormFooter
							backLink={backLink}
							step={step}
							isPending={submitMutation.isPending}
							disabled={isSubmitDisabled}
						/>
					</form>
				</Form>
			</div>
		</div>
	);
}
