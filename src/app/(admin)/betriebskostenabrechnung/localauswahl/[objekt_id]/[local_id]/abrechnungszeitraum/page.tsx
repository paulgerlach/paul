import { getObjectById } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import BetriebskostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Betriebskostenabrechnung/BetriebskostenabrechnungReceipt";
import AbrechnungszeitraumLocalForm from "@/components/Admin/Forms/DocPreparing/AbrechnungszeitraumLocalForm";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";

export default async function AbrechnungszeitraumPage({
  params,
}: {
  params: Promise<{ objekt_id: string; local_id: string }>;
}) {
  const { objekt_id, local_id } = await params;

  const objekt = await getObjectById(objekt_id);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Betriebskostenabrechnung"
        link={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/localauswahl/${objekt_id}`}
        title={`Abrechnungszeitraum`}
        subtitle="Handelt es sich hierbei um einen Auzug oder Einzug? Bitte geben Sie den gewünschten Abrechnungszeitraum ein."
      />
      <CreateDocContentWrapper>
        <AbrechnungszeitraumLocalForm localId={local_id} id={objekt_id} />
        <BetriebskostenabrechnungReceipt title={`${objekt.street} ${objekt.zip}`} />
      </CreateDocContentWrapper>
    </div>
  );
}
