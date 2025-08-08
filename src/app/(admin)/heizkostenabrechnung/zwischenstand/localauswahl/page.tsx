import { getObjekts } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteItemDoc from "@/components/Admin/ObjekteItem/ObjekteItemDoc";
import { ROUTE_DASHBOARD, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function ZwischenstandPage() {
  const objekts = await getObjekts();
  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Dashboard"
        link={ROUTE_DASHBOARD}
        title="Dokumentenübersicht"
        subtitle="Für welche Immobilie wollen Sie eine Heizkostenabrechnung erstellen lassen?"
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto]">
        <div className="overflow-y-auto space-y-4">
          {objekts.map((objekt) => (
            <ObjekteItemDoc
              docLink={`${ROUTE_HEIZKOSTENABRECHNUNG}/zwischenstand/localauswahl/${objekt.id}`}
              key={objekt.id}
              item={objekt}
            />
          ))}
        </div>
      </ContentWrapper>
    </div>
  );
}
