import {
  getAdminContractsByLocalID,
  getAdminHeatingBillDocumentByID,
  getDocCostCategoryTypes,
  getLocalById,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungReceipt";
import AdminUmlageschlüsselLocalForm from "@/components/Admin/Forms/DocPreparing/Umlageschlüssel/Admin/AdminLocalForm";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { buildLocalName } from "@/utils";

export default async function UmlageschlüsselEditPage({
  params,
}: {
  params: Promise<{ doc_id: string; user_id: string; path_slug: string }>;
}) {
  const { doc_id, user_id, path_slug } = await params;

  const doc = await getAdminHeatingBillDocumentByID(doc_id, user_id);
  const userDocCostCategories = await getDocCostCategoryTypes(
    "heizkostenabrechnung",
    user_id
  );

  const localId = doc?.local_id ?? "";
  const localData = localId ? await getLocalById(localId) : ({} as any);
  const contracts = localId
    ? await getAdminContractsByLocalID(localId, user_id)
    : [];

  const localWithContacts = { ...localData, contracts };

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/weitermachen/${doc_id}/${path_slug}/gesamtkosten`}
        title={`Umlageschlüssel erstellen`}
        subtitle="Bitte ergänzen Sie die Umlageschlüssel der Kostenkategorien. Mit dem Umlageschlüssel geben Sie als Vermieter vor, wie Sie die Kosten auf die verschiedenen Mietparteien im Haus verteilst."
      />
      <CreateDocContentWrapper>
        <AdminUmlageschlüsselLocalForm
          objektId={doc.objekt_id ?? ""}
          localId={doc.local_id ?? ""}
          docId={doc_id}
          pathSlug={path_slug}
          userId={user_id}
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
