import {
  getDocCostCategoryTypes,
  getObjectById,
  getOperatingCostDocumentByID,
  getRelatedLocalsWithContractsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import BetriebskostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Betriebskostenabrechnung/BetriebskostenabrechnungReceipt";
import AdminUmlageschlüsselBuildingForm from "@/components/Admin/Forms/DocPreparing/Umlageschlüssel/Admin/AdminBuildingForm";
import { ROUTE_ADMIN, ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";

export default async function UmlageschlüsselEditPage({
  params,
}: {
  params: Promise<{ doc_id: string; user_id: string }>;
}) {
  const { doc_id, user_id } = await params;

  const doc = await getOperatingCostDocumentByID(doc_id);
  const userDocCostCategories = await getDocCostCategoryTypes(
    "betriebskostenabrechnung"
  );

  const objekt = await getObjectById(doc.objekt_id ?? "");
  const locals = await getRelatedLocalsWithContractsByObjektId(
    doc.objekt_id ?? ""
  );

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${doc.objekt_id}/gesamtkosten`}
        title={`Umlageschlüssel erstellen`}
        subtitle="Bitte ergänzen Sie die Umlageschlüssel der Kostenkategorien. Mit dem Umlageschlüssel geben Sie als Vermieter vor, wie Sie die Kosten auf die verschiedenen Mietparteien im Haus verteilst."
      />
      <CreateDocContentWrapper>
        <AdminUmlageschlüsselBuildingForm
          objektId={doc.objekt_id ?? ""}
          userId={user_id}
          operatingDocId={doc_id}
          initialDocumentGroups={userDocCostCategories}
          isEditMode
        />
        <BetriebskostenabrechnungReceipt
          locals={locals}
          title={`${objekt.street} ${objekt.zip}`}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
