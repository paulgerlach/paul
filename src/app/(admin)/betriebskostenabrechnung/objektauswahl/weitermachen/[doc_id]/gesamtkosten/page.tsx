import {
  getDocCostCategoryTypes,
  getInvoicesByOperatingCostDocumentID,
  getObjectById,
  getOperatingCostDocumentByID,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import BetriebskostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Betriebskostenabrechnung/BetriebskostenabrechnungReceipt";
import GesamtkostenBuildingForm from "@/components/Admin/Forms/DocPreparing/Gesamtkosten/BuildingForm";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";

export default async function GesamtkostenEditPage({
  params,
}: {
  params: Promise<{ doc_id: string }>;
}) {
  const { doc_id } = await params;

  const doc = await getOperatingCostDocumentByID(doc_id);
  const userDocCostCategories = await getDocCostCategoryTypes(
    "betriebskostenabrechnung"
  );

  const relatedToDocInvoices =
    await getInvoicesByOperatingCostDocumentID(doc_id);

  const objekt = await getObjectById(doc.objekt_id ?? "");

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/weitermachen/${doc.objekt_id}/abrechnungszeitraum`}
        title={`Gesamtkosten für das Objekt`}
        subtitle="Bitte erfassen Sie hier alle Kosten, die auf das gesamte Gebäude entfallen. Fügen Sie einzelne Ausgaben direkt zu den jeweiligen Kostenarten hinzu. Sie können auch eigene Kostenarten anstatt der vordefinierten Kostenarten anlegen."
      />
      <CreateDocContentWrapper>
        <GesamtkostenBuildingForm
          objektId={doc.objekt_id ?? ""}
          operatingDocId={doc.id ?? ""}
          userDocCostCategories={userDocCostCategories}
          relatedInvoices={relatedToDocInvoices}
        />
        <BetriebskostenabrechnungReceipt
          title={`${objekt.street} ${objekt.zip}`}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
