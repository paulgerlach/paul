import { getObjektsByUserID } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteItemDoc from "@/components/Admin/ObjekteItem/ObjekteItemDoc";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG, ROUTE_ADMIN } from "@/routes/routes";

export default async function ObjektPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;
  const objekts = await getObjektsByUserID(user_id);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Dashboard"
        link={`${ROUTE_ADMIN}/${user_id}/zwischenstand`}
        title="Auswahl der Objektart"
        subtitle="Für welche Immobilie wollen Sie eine Betriebskostenabrechnung erstellen lassen?"
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto] max-h-[90%]">
        <div className="overflow-y-auto space-y-4">
          {objekts.map((objekt) => (
            <ObjekteItemDoc
              docLink={`${ROUTE_ADMIN}/${user_id}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objekt.id}/abrechnungszeitraum`}
              key={objekt.id}
              item={objekt}
            />
          ))}
        </div>
      </ContentWrapper>
    </div>
  );
}
