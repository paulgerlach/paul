import {
  getContractsByLocalID,
  getDocCostCategoryTypes,
  getHeatingBillDocumentByID,
  getLocalById,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungReceipt";
import UmlageschlüsselLocalForm from "@/components/Admin/Forms/DocPreparing/Umlageschlüssel/LocalForm";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import { buildLocalName } from "@/utils";

export default async function UmlageschlüsselEditPage({
  params,
}: {
  params: Promise<{ doc_id: string }>;
}) {
  const { doc_id } = await params;

  const doc = await getHeatingBillDocumentByID(doc_id);
  const userDocCostCategories = await getDocCostCategoryTypes(
    "heizkostenabrechnung"
  );

  const localData = await getLocalById(doc.local_id ? doc.local_id : "");
  const contracts = await getContractsByLocalID(
    doc.local_id ? doc.local_id : ""
  );

  const localWithContacts = { ...localData, contracts };

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${doc.objekt_id}/gesamtkosten`}
        title={`Umlageschlüssel erstellen`}
        subtitle="Bitte ergänzen Sie die Umlageschlüssel der Kostenkategorien. Mit dem Umlageschlüssel geben Sie als Vermieter vor, wie Sie die Kosten auf die verschiedenen Mietparteien im Haus verteilst."
      />
      <CreateDocContentWrapper>
        <UmlageschlüsselLocalForm
          objektId={doc.objekt_id ?? ""}
          localId={doc.local_id ?? ""}
          docId={doc_id}
          initialDocumentGroups={userDocCostCategories}
          isEditMode
        />
        <HeizkostenabrechnungReceipt
          local={localWithContacts}
          title={buildLocalName(localData)}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
