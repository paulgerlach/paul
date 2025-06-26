import { getBasicHeizkostenabrechnungDocCostCategoryTypes, getLocalById, getUserHeizkostenabrechnungDocCostCategoryTypes } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungReceipt";
import GesamtkostenForm from "@/components/Admin/Forms/DocPreparing/GesamtkostenFrom";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { buildLocalName } from "@/utils";

export default async function GesamtkostenPage({
  params,
}: {
  params: Promise<{ objekt_id: string; local_id: string }>;
}) {
  const { objekt_id, local_id } = await params;

  const localData = await getLocalById(local_id);
  const basicDocCosyCategories = await getBasicHeizkostenabrechnungDocCostCategoryTypes();
  const userDocCostCategories = await getUserHeizkostenabrechnungDocCostCategoryTypes();

  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objekt_id}/${local_id}/abrechnungszeitraum`}
        title={`Gesamtkosten für das Objekt`}
        subtitle="Bitte erfassen Sie hier alle Kosten, die auf das gesamte Gebäude entfallen. Fügen Sie einzelne Ausgaben direkt zu den jeweiligen Kostenarten hinzu. Sie können auch eigene Kostenarten anstatt der vordefinierten Kostenarten anlegen."
      />
      <CreateDocContentWrapper>
        <GesamtkostenForm basicDocCosyCategories={basicDocCosyCategories} userDocCostCategories={userDocCostCategories} objektId={objekt_id} localId={local_id} />
        <HeizkostenabrechnungReceipt objektId={objekt_id} localId={local_id} title={buildLocalName(localData)} />
      </CreateDocContentWrapper>
    </div>
  );
}
