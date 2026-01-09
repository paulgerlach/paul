import {
  getAdminContractsByLocalID,
  getDocCostCategoryTypes,
  getAdminHeatingBillDocumentByID,
  getAdminInvoicesByHeatingBillDocumentID,
  getLocalById,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungReceipt";
import AdminGesamtkostenLocalForm from "@/components/Admin/Forms/DocPreparing/Gesamtkosten/Admin/AdminLocalForm";
import { ROUTE_ADMIN, ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import { LocalType } from "@/types";
import { buildLocalName } from "@/utils";

export default async function GesamtkostenEditPage({
  params,
}: {
  params: Promise<{ doc_id: string; user_id: string }>;
}) {
  const { doc_id, user_id } = await params;

  const doc = await getAdminHeatingBillDocumentByID(doc_id, user_id);
  const userDocCostCategories = await getDocCostCategoryTypes(
    "heizkostenabrechnung",
    user_id
  );

  const relatedToDocInvoices = await getAdminInvoicesByHeatingBillDocumentID(doc_id, user_id);

  const localData = doc.local_id ? await getLocalById(doc.local_id) : ({} as LocalType);
  const contracts = doc.local_id
    ? await getAdminContractsByLocalID(doc.local_id, user_id)
    : [];

  const localWithContacts = { ...localData, contracts };

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${doc.objekt_id}/abrechnungszeitraum`}
        title={`Gesamtkosten für das Objekt`}
        subtitle="Bitte erfassen Sie hier alle Kosten, die auf das gesamte Gebäude entfallen. Fügen Sie einzelne Ausgaben direkt zu den jeweiligen Kostenarten hinzu. Sie können auch eigene Kostenarten anstatt der vordefinierten Kostenarten anlegen."
      />
      <CreateDocContentWrapper>
        <AdminGesamtkostenLocalForm
          objektId={doc.objekt_id ?? ""}
          localId={doc.local_id ?? ""}
          docId={doc_id}
          userId={user_id}
          userDocCostCategories={userDocCostCategories}
          relatedInvoices={relatedToDocInvoices}
        />
        <HeizkostenabrechnungReceipt
          local={localWithContacts}
          title={buildLocalName(localData)}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
