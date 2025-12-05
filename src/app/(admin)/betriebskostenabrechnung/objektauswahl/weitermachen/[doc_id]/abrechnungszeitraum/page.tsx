import {
  getObjectById,
  getOperatingCostDocumentByID,
  getRelatedLocalsWithContractsByObjektId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import BetriebskostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Betriebskostenabrechnung/BetriebskostenabrechnungReceipt";
import AbrechnungszeitraumBuildingForm from "@/components/Admin/Forms/DocPreparing/Abrechnungszeitraum/BuildingForm";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";

export default async function AbrechnungszeitraumContinuePage({
  params,
}: {
  params: Promise<{ doc_id: string }>;
}) {
  const { doc_id } = await params;

  const doc = await getOperatingCostDocumentByID(doc_id);

  const objekt = await getObjectById(doc.objekt_id ?? "");
  const locals = await getRelatedLocalsWithContractsByObjektId(
    doc.objekt_id ?? ""
  );

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Heizkostenabrechnung"
        link={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl`}
        title={`Abrechnungszeitraum`}
        subtitle="Handelt es sich hierbei um einen Auzug oder Einzug? Bitte geben Sie den gewünschten Abrechnungszeitraum ein."
      />
      <CreateDocContentWrapper>
        <AbrechnungszeitraumBuildingForm
          id={doc.objekt_id ?? ""}
          docValues={doc}
        />
        <BetriebskostenabrechnungReceipt
          locals={locals}
          title={`${objekt.street} ${objekt.zip}`}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
