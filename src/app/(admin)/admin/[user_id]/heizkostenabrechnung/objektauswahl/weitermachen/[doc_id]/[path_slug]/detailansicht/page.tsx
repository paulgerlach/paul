import {
	getAdminHeatingBillDocumentByID,
	getAdminHeatingInvoicesByHeatingBillDocumentID,
	getRelatedLocalsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import AdminDetailansichtFrom from "@/components/Admin/Forms/DocPreparing/Detailansicht/Admin/AdminDetailansichtFrom";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function DetailansichtPage({
	params,
}: {
	params: Promise<{
		doc_id: string;
		path_slug: string;
		user_id: string;
	}>;
}) {
	const { doc_id, path_slug, user_id } = await params;

	const doc = await getAdminHeatingBillDocumentByID(doc_id, user_id);

	const relatedToDocInvoices =
		await getAdminHeatingInvoicesByHeatingBillDocumentID(doc_id, user_id);

	const locals = await getRelatedLocalsByObjektId(doc.objekt_id ?? "");

	const backLink = `${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/weitermachen/${doc_id}/${path_slug}/dokumentenmanagement`;

	return (
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
			<Breadcrumb
				backTitle="Dokumentenmanagement"
				link={backLink}
				title={`Detailansicht`}
				subtitle="Die fertig erstellten Heizkostenabrechnung können nun die bequem bearbeiten und anschließend an Ihre Mieter teilen"
			/>
			<CreateDocContentWrapper>
				<AdminDetailansichtFrom
					locals={locals}
					relatedInvoices={relatedToDocInvoices}
					objektId={doc.objekt_id ?? ""}
					docId={doc_id}
					userId={user_id}
					pathSlug={path_slug} />
			</CreateDocContentWrapper>
		</div>
	);
}
