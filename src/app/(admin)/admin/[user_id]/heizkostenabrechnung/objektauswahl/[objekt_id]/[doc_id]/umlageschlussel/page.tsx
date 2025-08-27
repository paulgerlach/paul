import {
  getDocCostCategoryTypes,
  getObjectById,
  getRelatedLocalsWithContractsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungBuildingReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungBuildingReceipt";
import UmlageschlüsselHeatObjektauswahlForm from "@/components/Admin/Forms/DocPreparing/Umlageschlüssel/HeatObjektauswahlForm";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function UmlageschlüsselPage({
  params,
}: {
  params: Promise<{ objekt_id: string; doc_id: string; user_id: string }>;
}) {
  const { objekt_id, doc_id, user_id } = await params;

  const objekt = await getObjectById(objekt_id);

  const userDocCostCategories = await getDocCostCategoryTypes(
    "heizkostenabrechnung"
  );
  const locals = await getRelatedLocalsWithContractsByObjektId(objekt_id);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objekt_id}/${doc_id}/gesamtkostens`}
        title={`Umlageschlüssel erstellen`}
        subtitle="Bitte ergänzen Sie die Umlageschlüssel der Kostenkategorien. Mit dem Umlageschlüssel geben Sie als Vermieter vor, wie Sie die Kosten auf die verschiedenen Mietparteien im Haus verteilst."
      />
      <CreateDocContentWrapper>
        <UmlageschlüsselHeatObjektauswahlForm
          initialDocumentGroups={userDocCostCategories}
          docId={doc_id}
          objektId={objekt_id}
        />
        <HeizkostenabrechnungBuildingReceipt
          locals={locals}
          title={`${objekt.street} ${objekt.zip}`}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
