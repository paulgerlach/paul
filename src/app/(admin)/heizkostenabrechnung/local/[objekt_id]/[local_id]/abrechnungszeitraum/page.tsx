import { getLocalById } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import Receipt from "@/components/Admin/Docs/Receipt/Receipt";
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
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/local/${objekt_id}`}
        title={`Abrechnungszeitraum`}
        subtitle="Handelt es sich hierbei um einen Auzug oder Einzug? Bitte geben Sie den gewünschten Abrechnungszeitraum ein."
      />
      <CreateDocContentWrapper className="max-h-[90%]">
        <AbrechnungszeitraumForm id={objekt_id} />
        <Receipt title={buildLocalName(localData)} />
      </CreateDocContentWrapper>
    </div>
  );
}
