import {
	getAdminHeatingBillDocumentByID,
	getAdminHeatingInvoicesByHeatingBillDocumentID,
	getDocCostCategoryTypes,
	getRelatedLocalsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import AdminDokumentenmanagementForm from "@/components/Admin/Forms/DocPreparing/Dokumentenmanagement/Admin/AdminDokumentenmanagementForm";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function DokumentenmanagementPage({
	params,
}: {
	params: Promise<{ doc_id: string; path_slug: string; user_id: string }>;
}) {
	const { doc_id, path_slug, user_id } = await params;

	const doc = await getAdminHeatingBillDocumentByID(doc_id, user_id);

	const userDocCostCategories = await getDocCostCategoryTypes(
		"heizkostenabrechnung",
	);

	const relatedToDocInvoices =
		await getAdminHeatingInvoicesByHeatingBillDocumentID(doc_id, user_id);

	const locals = await getRelatedLocalsByObjektId(doc.objekt_id ?? "");

	return (
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
			<Breadcrumb
				backTitle="Abrechnung"
				link={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/weitermachen/${doc_id}/abrechnungszeitraum`}
				title={`Dokumentenmanagement`}
				subtitle="Ladden Sie alle Ihre Rechnungen und Zahlungsnachweise die für die Betriebskostenabrechnung wichtig sind hoch."
			/>
			<CreateDocContentWrapper>
				<AdminDokumentenmanagementForm
					relatedInvoices={relatedToDocInvoices}
					userDocCostCategories={userDocCostCategories}
					docId={doc_id}
					pathSlug={path_slug}
					objektId={doc.objekt_id ?? ""}
					userId={user_id}
					locals={locals}
				/>
			</CreateDocContentWrapper>
		</div>
	);
}
