import {
  getAdminContractsByLocalID,
  getAdminHeatingBillDocumentByID,
  getLocalById,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import HeizkostenabrechnungReceipt from "@/components/Admin/Docs/Receipt/Heizkostenabrechnung/HeizkostenabrechnungReceipt";
import AdminAbrechnungszeitraumLocalForm from "@/components/Admin/Forms/DocPreparing/Abrechnungszeitraum/Admin/AdminLocalForm";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { LocalType } from "@/types";
import { buildLocalName } from "@/utils";

export default async function AbrechnungszeitraumContinuePage({
  params,
}: {
  params: Promise<{ doc_id: string; user_id: string }>;
}) {
  const { doc_id, user_id } = await params;

  const doc = await getAdminHeatingBillDocumentByID(doc_id, user_id);

  const localData = doc.local_id ? await getLocalById(doc.local_id) : ({} as LocalType);
  const contracts = doc.local_id
    ? await getAdminContractsByLocalID(doc.local_id, user_id)
    : [];

  const localWithContacts = { ...localData, contracts };

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Heizkostenabrechnung"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl`}
        title={`Abrechnungszeitraum`}
        subtitle="Handelt es sich hierbei um einen Auzug oder Einzug? Bitte geben Sie den gewünschten Abrechnungszeitraum ein."
      />
      <CreateDocContentWrapper>
        <AdminAbrechnungszeitraumLocalForm
          objektID={doc.objekt_id ?? ""}
          localId={doc.local_id ?? ""}
          docValues={doc}
          userID={user_id}
        />
        <HeizkostenabrechnungReceipt
          local={localWithContacts}
          title={buildLocalName(localData)}
        />
      </CreateDocContentWrapper>
    </div>
  );
}
