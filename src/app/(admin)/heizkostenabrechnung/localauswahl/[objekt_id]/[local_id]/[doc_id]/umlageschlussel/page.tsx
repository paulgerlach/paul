import {
  getContractsByLocalID,
  getDocCostCategoryTypes,
  getLocalById,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungReceipt";
import UmlageschlüsselLocalForm from "@/components/Admin/Forms/DocPreparing/Umlageschlüssel/LocalForm";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { buildLocalName } from "@/utils";

export default async function UmlageschlüsselPage({
  params,
}: {
  params: Promise<{ objekt_id: string; local_id: string; doc_id: string }>;
}) {
  const { objekt_id, local_id, doc_id } = await params;

  const localData = await getLocalById(local_id);

  const relatedContracts = await getContractsByLocalID(local_id);

  const userDocCostCategories = await getDocCostCategoryTypes(
    "heizkostenabrechnung"
  );

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objekt_id}/${local_id}/${doc_id}/gesamtkostens`}
        title={`Umlageschlüssel erstellen`}
        subtitle="Bitte ergänzen Sie die Umlageschlüssel der Kostenkategorien. Mit dem Umlageschlüssel geben Sie als Vermieter vor, wie Sie die Kosten auf die verschiedenen Mietparteien im Haus verteilst."
      />
      <CreateDocContentWrapper>
        <UmlageschlüsselLocalForm
        objektId={objekt_id}
        localId={local_id}
        docId={doc_id}
        initialDocumentGroups={userDocCostCategories}
      />
        <HeizkostenabrechnungReceipt
          title={buildLocalName(localData)}
          relatedContracts={relatedContracts}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
