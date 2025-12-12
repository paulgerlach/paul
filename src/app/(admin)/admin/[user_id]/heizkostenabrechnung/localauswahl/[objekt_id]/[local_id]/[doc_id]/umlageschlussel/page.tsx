import {
  getAdminContractsByLocalID,
  getDocCostCategoryTypes,
  getLocalById,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungReceipt";
import AdminUmlageschlüsselLocalForm from "@/components/Admin/Forms/DocPreparing/Umlageschlüssel/Admin/AdminLocalForm";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { buildLocalName } from "@/utils";

export default async function UmlageschlüsselPage({
  params,
}: {
  params: Promise<{
    objekt_id: string;
    local_id: string;
    doc_id: string;
    user_id: string;
  }>;
}) {
  const { objekt_id, local_id, doc_id, user_id } = await params;

  const localData = await getLocalById(local_id);

  const userDocCostCategories = await getDocCostCategoryTypes(
    "heizkostenabrechnung",
    user_id
  );

  const contracts = await getAdminContractsByLocalID(local_id, user_id);

  const localWithContacts = { ...localData, contracts };

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objekt_id}/${local_id}/${doc_id}/gesamtkostens`}
        title={`Umlageschlüssel erstellen`}
        subtitle="Bitte ergänzen Sie die Umlageschlüssel der Kostenkategorien. Mit dem Umlageschlüssel geben Sie als Vermieter vor, wie Sie die Kosten auf die verschiedenen Mietparteien im Haus verteilst."
      />
      <CreateDocContentWrapper>
        <AdminUmlageschlüsselLocalForm
          objektId={objekt_id}
          localId={local_id}
          docId={doc_id}
          userId={user_id}
          initialDocumentGroups={userDocCostCategories}
        />
        <HeizkostenabrechnungReceipt
          title={buildLocalName(localData)}
          local={localWithContacts}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
