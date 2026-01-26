import {
  getContractsWithContractorsByLocalID,
  getDocCostCategoryTypes,
  getInvoicesByOperatingCostDocumentID,
  getLocalById,
  getObjectById,
  getOperatingCostDocumentByID,
  getRelatedLocalsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import BetriebskostenabrechnungPreview from "@/components/Admin/Docs/Render/BetriebskostenabrechnungPdf/BetriebskostenabrechnungPreview";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";

export default async function ResultBuildingLocalPreview({
  params,
}: {
  params: Promise<{ objekt_id: string; doc_id: string; local_id: string }>;
}) {
  const { objekt_id, doc_id, local_id } = await params;

  const [
    objekt,
    relatedLocals,
    costCategories,
    mainDoc,
    contracts,
    invoices,
    local,
  ] = await Promise.all([
    getObjectById(objekt_id),
    getRelatedLocalsByObjektId(objekt_id),
    getDocCostCategoryTypes("betriebskostenabrechnung"),
    getOperatingCostDocumentByID(doc_id),
    getContractsWithContractorsByLocalID(local_id),
    getInvoicesByOperatingCostDocumentID(doc_id),
    getLocalById(local_id),
  ]);

  const totalLivingSpace =
    relatedLocals?.reduce((sum, local) => {
      return sum + (Number(local.living_space) || 0);
    }, 0) || 0;

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objekt_id}/${doc_id}/results`}
        title="Detailansicht"
        subtitle="Die fertig erstellten Betriebskostenabrechnung können nun die "
      />
      <ContentWrapper className="space-y-4 max-medium:space-y-3">
        <BetriebskostenabrechnungPreview
          mainDoc={mainDoc}
          previewLocal={local}
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
