import {
  getDocCostCategoryTypes,
  getObjectById,
  getRelatedLocalsWithContractsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungBuildingReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungBuildingReceipt";
import AdminGesamtkostenHeatObjektauswahlForm from "@/components/Admin/Forms/DocPreparing/Gesamtkosten/Admin/AdminHeatObjektauswahlForm";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function GesamtkostenPage({
  params,
}: {
  params: Promise<{ objekt_id: string; doc_id: string; user_id: string }>;
}) {
  const { objekt_id, doc_id, user_id } = await params;

  const objekt = await getObjectById(objekt_id);
  const userDocCostCategories = await getDocCostCategoryTypes(
    "heizkostenabrechnung",
    user_id
  );
  const locals = await getRelatedLocalsWithContractsByObjektId(objekt_id);

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objekt_id}/abrechnungszeitraum`}
        title={`Gesamtkosten für das Objekt`}
        subtitle="Bitte erfassen Sie hier alle Kosten, die auf das gesamte Gebäude entfallen. Fügen Sie einzelne Ausgaben direkt zu den jeweiligen Kostenarten hinzu. Sie können auch eigene Kostenarten anstatt der vordefinierten Kostenarten anlegen."
      />
      <CreateDocContentWrapper>
        <AdminGesamtkostenHeatObjektauswahlForm
          userDocCostCategories={userDocCostCategories}
          objektId={objekt_id}
          docId={doc_id}
          userId={user_id}
        />
        <HeizkostenabrechnungBuildingReceipt
          locals={locals}
          title={`${objekt.street} ${objekt.zip}`}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
