import { getDocCostCategoryTypes, getObjectById } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungReceipt";
import GesamtkostenHeatObjektauswahlForm from "@/components/Admin/Forms/DocPreparing/Gesamtkosten/HeatObjektauswahlForm";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function GesamtkostenPage({
  params,
}: {
  params: Promise<{ objekt_id: string; doc_id: string }>;
}) {
  const { objekt_id, doc_id } = await params;

  const objekt = await getObjectById(objekt_id);
  const userDocCostCategories = await getDocCostCategoryTypes(
    "heizkostenabrechnung"
  );

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objekt_id}/abrechnungszeitraum`}
        title={`Gesamtkosten für das Objekt`}
        subtitle="Bitte erfassen Sie hier alle Kosten, die auf das gesamte Gebäude entfallen. Fügen Sie einzelne Ausgaben direkt zu den jeweiligen Kostenarten hinzu. Sie können auch eigene Kostenarten anstatt der vordefinierten Kostenarten anlegen."
      />
      <CreateDocContentWrapper>
        <GesamtkostenHeatObjektauswahlForm
          userDocCostCategories={userDocCostCategories}
          objektId={objekt_id}
          docId={doc_id}
        />
        <HeizkostenabrechnungReceipt title={`${objekt.street} ${objekt.zip}`} />
      </CreateDocContentWrapper>
    </div>
  );
}
