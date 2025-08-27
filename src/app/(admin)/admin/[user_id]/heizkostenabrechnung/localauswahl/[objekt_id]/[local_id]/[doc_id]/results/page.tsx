import { getLocalById } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminObjekteLocalItemHeatingBillDocResult from "@/components/Admin/ObjekteLocalItem/Admin/AdminObjekteLocalItemHeatingBillDocResult";
import ObjekteLocalItemHeatingBillDocResult from "@/components/Admin/ObjekteLocalItem/ObjekteLocalItemHeatingBillDocResult";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function ResultLocalPDF({
  params,
}: {
  params: Promise<{
    objekt_id: string;
    local_id: string;
    doc_id: string;
    user_id: string;
  }>;
}) {
  const { objekt_id, local_id, doc_id, user_id } = await params;

  const localData = await getLocalById(local_id);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}`}
        title="Detailansicht"
        subtitle="Die fertig erstellten Heizkostenabrechnung können nun die "
      />
      <ContentWrapper className="space-y-4 max-h-[90%]">
        <AdminObjekteLocalItemHeatingBillDocResult
          objektID={objekt_id}
          userID={user_id}
          item={localData}
          docType="localauswahl"
          docID={doc_id}
        />
      </ContentWrapper>
    </div>
  );
}
