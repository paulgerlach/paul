import {
  getActiveContractByLocalID,
  getDocCostCategoryTypes,
  getInvoicesByOperatingCostDocumentID,
  getLocalById,
  getObjectById,
  getOperatingCostDocumentByID,
  getRelatedContractors,
  getRelatedLocalsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import BetriebskostenabrechnungPreview from "@/components/Admin/Docs/Render/BetriebskostenabrechnungPdf/BetriebskostenabrechnungPreview";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export default async function ResultBuildingLocalPreview({
  params,
}: {
  params: Promise<{ objekt_id: string; doc_id: string; local_id: string }>;
}) {
  const { objekt_id, doc_id, local_id } = await params;

  const objekt = await getObjectById(objekt_id);
  const relatedLocals = await getRelatedLocalsByObjektId(objekt_id);
  const costCategories = await getDocCostCategoryTypes(
    "betriebskostenabrechnung"
  );
  const mainDoc = await getOperatingCostDocumentByID(doc_id);
  const contract = await getActiveContractByLocalID(local_id);
  const invoices = await getInvoicesByOperatingCostDocumentID(doc_id);
  const local = await getLocalById(local_id);
  const contractors = contract?.id
    ? await getRelatedContractors(contract.id)
    : [];

  const totalLivingSpace =
    relatedLocals?.reduce((sum, local) => {
      return sum + (Number(local.living_space) || 0);
    }, 0) || 0;

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={ROUTE_OBJEKTE}
        title="Detailansicht"
        subtitle="Die fertig erstellten Betriebskostenabrechnung können nun die "
      />
      <ContentWrapper className="space-y-4">
        <BetriebskostenabrechnungPreview
          mainDoc={mainDoc}
          previewLocal={local}
          totalLivingSpace={totalLivingSpace}
          costCategories={costCategories}
          invoices={invoices}
          contract={contract}
          contractors={contractors}
          objekt={objekt}
        />
      </ContentWrapper>
    </div>
  );
}
