import {
  getAdminHeatingInvoicesByHeatingBillDocumentID,
  getDocCostCategoryTypes,
  getHeatingBillDocumentByID,
  getObjectById,
  getRelatedLocalsWithContractsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungBuildingReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungBuildingReceipt";
import GesamtkostenHeatObjektauswahlForm from "@/components/Admin/Forms/DocPreparing/Gesamtkosten/HeatObjektauswahlForm";
import { ROUTE_ADMIN, ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";

export default async function GesamtkostenEditPage({
  params,
}: {
  params: Promise<{ doc_id: string; user_id: string }>;
}) {
  const { doc_id, user_id } = await params;

  const doc = await getHeatingBillDocumentByID(doc_id);
  const userDocCostCategories = await getDocCostCategoryTypes(
    "heizkostenabrechnung"
  );

  const relatedToDocInvoices = await getAdminHeatingInvoicesByHeatingBillDocumentID(doc_id, user_id);

  const objekt = await getObjectById(doc.objekt_id ?? "");
  const locals = await getRelatedLocalsWithContractsByObjektId(
    doc.objekt_id ?? ""
  );

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${doc.objekt_id}/abrechnungszeitraum`}
        title={`Gesamtkosten für das Objekt`}
        subtitle="Bitte erfassen Sie hier alle Kosten, die auf das gesamte Gebäude entfallen. Fügen Sie einzelne Ausgaben direkt zu den jeweiligen Kostenarten hinzu. Sie können auch eigene Kostenarten anstatt der vordefinierten Kostenarten anlegen."
      />
      <CreateDocContentWrapper>
        <GesamtkostenHeatObjektauswahlForm
          userDocCostCategories={userDocCostCategories}
          relatedInvoices={relatedToDocInvoices}
          objektId={doc.objekt_id ?? ""}
          docId={doc_id ?? ""}
        />
        <HeizkostenabrechnungBuildingReceipt
          locals={locals}
          title={`${objekt.street} ${objekt.zip}`}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
