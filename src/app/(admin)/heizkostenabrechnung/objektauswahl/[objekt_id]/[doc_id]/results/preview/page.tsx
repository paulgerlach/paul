import {
  // getActiveContractByLocalID,
  getDocCostCategoryTypes,
  getInvoicesByOperatingCostDocumentID,
  // getLocalById,
  getObjectById,
  getOperatingCostDocumentByID,
  // getRelatedContractors,
  getRelatedLocalsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
// import HeatingBillPreview from "@/components/Admin/Docs/Render/HeatingBillPreview/HeatingBillPreview";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function ResultLocalPreview({
  params,
}: {
  params: Promise<{ objekt_id: string; doc_id: string }>;
}) {
  const { objekt_id, doc_id } = await params;

  const [
    objekt,
    relatedLocals,
    costCategories,
    mainDoc,
    // contract,
    invoices,
    // local,
  ] = await Promise.all([
    getObjectById(objekt_id),
    getRelatedLocalsByObjektId(objekt_id),
    getDocCostCategoryTypes("heizkostenabrechnung"),
    getOperatingCostDocumentByID(doc_id),
    // getActiveContractByLocalID(local_id),
    getInvoicesByOperatingCostDocumentID(doc_id),
    // getLocalById(local_id),
  ]);

  // const contractors = contract?.id
  //   ? await getRelatedContractors(contract.id)
  //   : [];

  const totalLivingSpace =
    relatedLocals?.reduce((sum, local) => {
      return sum + (Number(local.living_space) || 0);
    }, 0) || 0;

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objekt_id}/${doc_id}/results`}
        title="Detailansicht"
        subtitle="Die fertig erstellten Heizkostenabrechnung können nun die "
      />
      <ContentWrapper className="space-y-4">
        {/* <HeatingBillPreview
        //   mainDoc={mainDoc}
        //   previewLocal={local}
        //   totalLivingSpace={totalLivingSpace}
        //   costCategories={costCategories}
        //   invoices={invoices}
        //   contract={contract}
        //   contractors={contractors}
        //   objekt={objekt}
        /> */}
      </ContentWrapper>
    </div>
  );
}
