import {
  fetchHeatingBillData,
  computeHeatingBill,
} from "@/app/api/heating-bill/_lib";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import HeatingBillPDFViewer from "@/components/Admin/Docs/Render/HeatingBillPDFViewer";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

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

  // Compute the PDF model server-side
  const rawData = await fetchHeatingBillData(doc_id, user_id, {
    useServiceRole: true,
  });
  const model = computeHeatingBill(rawData, { targetLocalId: local_id });

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objekt_id}/${doc_id}/results`}
        title="Detailansicht"
        subtitle="Die fertig erstellten Heizkostenabrechnung können nun die "
      />
      <ContentWrapper className="space-y-4">
        <HeatingBillPDFViewer model={model} />
      </ContentWrapper>
    </div>
  );
}

