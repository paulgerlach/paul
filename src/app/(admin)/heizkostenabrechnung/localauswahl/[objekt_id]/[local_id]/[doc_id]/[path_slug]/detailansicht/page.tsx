import {
	getRelatedLocalsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import DetailansichtLocalFrom from "@/components/Admin/Forms/DocPreparing/Detailansicht/DetailansichtLocalFrom";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function DetailansichtPage({
	params,
}: {
	params: Promise<{
		doc_id: string;
		path_slug: string;
		objekt_id: string;
		local_id: string;
	}>;
}) {
	const { doc_id, path_slug, objekt_id, local_id } = await params;

	const locals = await getRelatedLocalsByObjektId(objekt_id);

	return (
		<div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
			<Breadcrumb
				backTitle="Dokumentenmanagement"
				link={`${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objekt_id}/${local_id}/${doc_id}/${path_slug}/dokumentenmanagement`}
				title={`Detailansicht`}
				subtitle="Die fertig erstellten Heizkostenabrechnung können nun die bequem bearbeiten und anschließend an Ihre Mieter teilen"
			/>
			<CreateDocContentWrapper>
				<DetailansichtLocalFrom
					locals={locals}
					objektId={objekt_id}
					docId={doc_id}
					localId={local_id}
					pathSlug={path_slug} />
			</CreateDocContentWrapper>
		</div>
	);
}
