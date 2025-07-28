import {
  getDocCostCategoryTypes,
  getHeatingBillDocumentByID,
  getInvoicesByHeatingBillDocumentID,
  getLocalById,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungReceipt";
import GesamtkostenEditForm from "@/components/Admin/Forms/DocPreparing/GesamtkostenEditFrom";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import { buildLocalName } from "@/utils";

export default async function GesamtkostenEditPage({
  params,
}: {
  params: Promise<{ doc_id: string }>;
}) {
  const { doc_id } = await params;

  const doc = await getHeatingBillDocumentByID(doc_id);
  const userDocCostCategories = await getDocCostCategoryTypes(
    "heizkostenabrechnung"
  );

  const relatedToDocInvoices = await getInvoicesByHeatingBillDocumentID(doc_id);

  const localData = await getLocalById(doc.local_id ? doc.local_id : "");

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${doc.objekt_id}/abrechnungszeitraum`}
        title={`Gesamtkosten für das Objekt`}
        subtitle="Bitte erfassen Sie hier alle Kosten, die auf das gesamte Gebäude entfallen. Fügen Sie einzelne Ausgaben direkt zu den jeweiligen Kostenarten hinzu. Sie können auch eigene Kostenarten anstatt der vordefinierten Kostenarten anlegen."
      />
      <CreateDocContentWrapper>
        <GesamtkostenEditForm
          userDocCostCategories={userDocCostCategories}
          relatedInvoices={relatedToDocInvoices}
          objektId={doc.objekt_id ?? ""}
          docId={doc_id ?? ""}
          localId={doc.local_id ?? ""}
        />
        <HeizkostenabrechnungReceipt title={buildLocalName(localData)} />
      </CreateDocContentWrapper>
    </div>
  );
}
