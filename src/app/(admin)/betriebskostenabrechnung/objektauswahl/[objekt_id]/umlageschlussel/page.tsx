import { getObjectById } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import BetriebskostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Betriebskostenabrechnung/BetriebskostenabrechnungReceipt";
import UmlageschlüsselBuildingFrom from "@/components/Admin/Forms/DocPreparing/UmlageschlüsselBuildingFrom";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function UmlageschlüsselPage({
  params,
}: {
  params: Promise<{ objekt_id: string; }>;
}) {
  const { objekt_id } = await params;

  const objekt = await getObjectById(objekt_id);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objekt_id}/gesamtkostens`}
        title={`Umlageschlüssel erstellen`}
        subtitle="Bitte ergänzen Sie die Umlageschlüssel der Kostenkategorien. Mit dem Umlageschlüssel geben Sie als Vermieter vor, wie Sie die Kosten auf die verschiedenen Mietparteien im Haus verteilst."
      />
      <CreateDocContentWrapper>
        <UmlageschlüsselBuildingFrom objektId={objekt_id} />
        <BetriebskostenabrechnungReceipt
          objektId={objekt_id}
          title={`${objekt.street} ${objekt.zip}`}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
