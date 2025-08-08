import { getHeatingBillDocumentByID, getObjectById } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungReceipt";
import AbrechnungszeitraumHeatObjektauswahlForm from "@/components/Admin/Forms/DocPreparing/Abrechnungszeitraum/HeatObjektauswahlForm";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function AbrechnungszeitraumContinuePage({
  params,
}: {
  params: Promise<{ doc_id: string }>;
}) {
  const { doc_id } = await params;

  const doc = await getHeatingBillDocumentByID(doc_id);

  const objekt = await getObjectById(doc.objekt_id ?? "");

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Heizkostenabrechnung"
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl`}
        title={`Abrechnungszeitraum`}
        subtitle="Handelt es sich hierbei um einen Auzug oder Einzug? Bitte geben Sie den gewünschten Abrechnungszeitraum ein."
      />
      <CreateDocContentWrapper>
        <AbrechnungszeitraumHeatObjektauswahlForm
          id={doc.objekt_id ?? ""}
          docValues={doc}
        />
        <HeizkostenabrechnungReceipt title={`${objekt.street} ${objekt.zip}`} />
      </CreateDocContentWrapper>
    </div>
  );
}
