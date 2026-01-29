import {
	getAdminContractsWithContractorsByLocalID,
	getAdminInvoicesByOperatingCostDocumentID,
	getAdminOperatingCostDocumentByID,
	getAdminUserData,
	getDocCostCategoryTypes,
	getInvoicesByOperatingCostDocumentID,
	getLocalById,
	getObjectById,
	getOperatingCostDocumentByID,
	getRelatedLocalsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import HeatingBillPreview from "@/components/Admin/Docs/Render/HeatingBillPreview/HeatingBillPreview";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function ResultLocalPreview({
	params,
}: {
	params: Promise<{
		objekt_id: string;
		doc_id: string;
		local_id: string;
		user_id: string;
	}>;
}) {
	const { objekt_id, doc_id, local_id, user_id } = await params;

	const [
		objekt,
		relatedLocals,
		costCategories,
		mainDoc,
		contracts,
		invoices,
		local,
		user,
	] = await Promise.all([
		getObjectById(objekt_id),
		getRelatedLocalsByObjektId(objekt_id),
		getDocCostCategoryTypes("heizkostenabrechnung"),
		getAdminOperatingCostDocumentByID(doc_id, user_id),
		getAdminContractsWithContractorsByLocalID(local_id, user_id),
		getAdminInvoicesByOperatingCostDocumentID(doc_id, user_id),
		getLocalById(local_id),
		getAdminUserData(user_id),
	]);

	console.log(mainDoc, "mainDOc");

	const totalLivingSpace =
		relatedLocals?.reduce((sum, local) => {
			return sum + (Number(local.living_space) || 0);
		}, 0) || 0;

	return (
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
			<Breadcrumb
				backTitle="Objekte"
				link={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objekt_id}/${local_id}/${doc_id}/results`}
				title="Detailansicht"
				subtitle="Die fertig erstellten Heizkostenabrechnung können nun die "
			/>
			<ContentWrapper className="space-y-4">
				<HeatingBillPreview
					mainDoc={mainDoc}
					local={local}
					user={user}
					totalLivingSpace={totalLivingSpace}
					costCategories={costCategories}
					invoices={invoices}
					contracts={contracts}
					objekt={objekt}
				/>
			</ContentWrapper>
		</div>
	);
}
