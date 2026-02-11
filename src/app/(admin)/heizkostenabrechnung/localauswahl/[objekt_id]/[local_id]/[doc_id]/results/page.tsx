import { getHeatingBillDocumentByID, getLocalById } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteLocalItemHeatingBillDocResult from "@/components/Admin/ObjekteLocalItem/ObjekteLocalItemHeatingBillDocResult";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import HeatingBillPendingModal from "@/components/Basic/Dialog/HeatingBillPendingModal";
import { isWithin24Hours } from "@/lib/heating-bill";

export default async function ResultLocalPDF({
  params,
}: {
  params: Promise<{ objekt_id: string; local_id: string; doc_id: string }>;
}) {
  const { objekt_id, local_id, doc_id } = await params;

  const [mainDoc, localData] = await Promise.all([
    getHeatingBillDocumentByID(doc_id),
    getLocalById(local_id),
  ]);

  const isPending =
    mainDoc?.submited === true &&
    isWithin24Hours(mainDoc?.created_at ?? null);

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      {isPending && <HeatingBillPendingModal initiallyOpen />}
      <Breadcrumb
        backTitle="Objekte"
        link={ROUTE_HEIZKOSTENABRECHNUNG}
        title="Detailansicht"
        subtitle="Die fertig erstellten Heizkostenabrechnung können nun die "
      />
      <ContentWrapper className="space-y-4 max-h-[90%]">
        <ObjekteLocalItemHeatingBillDocResult
          id={objekt_id}
          item={localData}
          docID={doc_id}
          docType="localauswahl"
          disabled={isPending}
        />
      </ContentWrapper>
    </div>
  );
}
