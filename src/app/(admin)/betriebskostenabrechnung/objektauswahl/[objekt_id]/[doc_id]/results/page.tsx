import { getRelatedLocalsByObjektId } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteLocalItemDocResult from "@/components/Admin/ObjekteLocalItem/ObjekteLocalItemDocResult";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";

export default async function ResultBuildingPag({
  params,
}: {
  params: Promise<{ objekt_id: string; doc_id: string }>;
}) {
  const { objekt_id, doc_id } = await params;

  const locals = await getRelatedLocalsByObjektId(objekt_id);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Umlageschlüssel"
        link={ROUTE_BETRIEBSKOSTENABRECHNUNG}
        title="Betriebskostenabrechnung erstellt"
        subtitle="Die fertig erstellten Betriebskostenabrechnungen können nun direkt an Ihre Mietparteien versendet oder bei Bedarf angepasst werden. Alle relevanten Zahlungsinformationen sind bereits automatisiert im Dokument hinterlegt."
      />
      <ContentWrapper className="space-y-4">
        <div className="overflow-y-auto space-y-4">
          {locals?.map((local) => (
            <ObjekteLocalItemDocResult
              id={objekt_id}
              localID={local.id}
              key={local.id}
              item={local}
              docID={doc_id}
            />
          ))}
        </div>
      </ContentWrapper>
    </div>
  );
}
