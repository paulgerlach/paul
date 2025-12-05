import {
  getDocCostCategoryTypes,
  getObjectById,
  getRelatedLocalsWithContractsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import BetriebskostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Betriebskostenabrechnung/BetriebskostenabrechnungReceipt";
import AdminUmlageschlüsselBuildingForm from "@/components/Admin/Forms/DocPreparing/Umlageschlüssel/Admin/AdminBuildingForm";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";

export default async function UmlageschlüsselPage({
  params,
}: {
  params: Promise<{ objekt_id: string; doc_id: string; user_id: string }>;
}) {
  const { objekt_id, doc_id, user_id } = await params;

  const objekt = await getObjectById(objekt_id);
  const userDocCostCategories = await getDocCostCategoryTypes(
    "betriebskostenabrechnung"
  );
  const locals = await getRelatedLocalsWithContractsByObjektId(objekt_id);

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objekt_id}/${doc_id}/gesamtkosten`}
        title={`Umlageschlüssel erstellen`}
        subtitle="Bitte ergänzen Sie die Umlageschlüssel der Kostenkategorien. Mit dem Umlageschlüssel geben Sie als Vermieter vor, wie Sie die Kosten auf die verschiedenen Mietparteien im Haus verteilst."
      />
      <CreateDocContentWrapper>
        <AdminUmlageschlüsselBuildingForm
          initialDocumentGroups={userDocCostCategories}
          operatingDocId={doc_id}
          objektId={objekt_id}
          userId={objekt_id}
        />
        <BetriebskostenabrechnungReceipt
          locals={locals}
          title={`${objekt.street} ${objekt.zip}`}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
