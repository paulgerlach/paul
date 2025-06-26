import { getBasicBetriebskostenabrechnungDocCostCategoryTypes, getObjectById, getUserBetriebskostenabrechnungDocCostCategoryTypes } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import BetriebskostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Betriebskostenabrechnung/BetriebskostenabrechnungReceipt";
import GesamtkostenBuildingForm from "@/components/Admin/Forms/DocPreparing/GesamtkostenBuildingFrom";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";

export default async function GesamtkostenPage({
  params,
}: {
  params: Promise<{ objekt_id: string; }>;
}) {
  const { objekt_id } = await params;

  const objekt = await getObjectById(objekt_id);
  const basicDocCosyCategories = await getBasicBetriebskostenabrechnungDocCostCategoryTypes();
  const userDocCostCategories = await getUserBetriebskostenabrechnungDocCostCategoryTypes();

  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objekt_id}/abrechnungszeitraum`}
        title={`Gesamtkosten für das Objekt`}
        subtitle="Bitte erfassen Sie hier alle Kosten, die auf das gesamte Gebäude entfallen. Fügen Sie einzelne Ausgaben direkt zu den jeweiligen Kostenarten hinzu. Sie können auch eigene Kostenarten anstatt der vordefinierten Kostenarten anlegen."
      />
      <CreateDocContentWrapper>
        <GesamtkostenBuildingForm basicDocCosyCategories={basicDocCosyCategories} userDocCostCategories={userDocCostCategories} objektId={objekt_id} />
        <BetriebskostenabrechnungReceipt objektId={objekt_id} title={`${objekt.street} ${objekt.zip}`} />
      </CreateDocContentWrapper>
    </div>
  );
}
