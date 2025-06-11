import { getLocalById } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungReceipt";
import AbrechnungszeitraumForm from "@/components/Admin/Forms/DocPreparing/AbrechnungszeitraumForm";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { buildLocalName } from "@/utils";

export default async function AbrechnungszeitraumPage({
  params,
}: {
  params: Promise<{ objekt_id: string; local_id: string }>;
}) {
  const { objekt_id, local_id } = await params;

  const localData = await getLocalById(local_id);

  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Heizkostenabrechnung"
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objekt_id}`}
        title={`Abrechnungszeitraum`}
        subtitle="Handelt es sich hierbei um einen Auzug oder Einzug? Bitte geben Sie den gewünschten Abrechnungszeitraum ein."
      />
      <CreateDocContentWrapper>
        <AbrechnungszeitraumForm localId={local_id} id={objekt_id} />
        <HeizkostenabrechnungReceipt title={buildLocalName(localData)} />
      </CreateDocContentWrapper>
    </div>
  );
}
