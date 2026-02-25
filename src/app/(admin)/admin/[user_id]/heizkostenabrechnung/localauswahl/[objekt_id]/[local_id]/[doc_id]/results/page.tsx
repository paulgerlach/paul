import {
  getLocalById,
  getDocumentsByHeatingBillDocId,
  getAdminContractsWithContractorsByLocalID,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminObjekteLocalItemHeatingBillDocResult from "@/components/Admin/ObjekteLocalItem/Admin/AdminObjekteLocalItemHeatingBillDocResult";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function ResultLocalPDF({
  params,
}: {
  params: Promise<{
    objekt_id: string;
    local_id: string;
    doc_id: string;
    user_id: string;
  }>;
}) {
  const { objekt_id, local_id, doc_id, user_id } = await params;

  const [localData, documentsByLocalId, contracts] = await Promise.all([
    getLocalById(local_id),
    getDocumentsByHeatingBillDocId(doc_id),
    getAdminContractsWithContractorsByLocalID(local_id, user_id),
  ]);

  // Build contract_id → tenant name map
  const contractIdToTenantName: Record<string, string> = {};
  if (contracts) {
    for (const contract of contracts) {
      const names = contract.contractors
        ?.map(
          (c: { first_name: string; last_name: string }) =>
            `${c.first_name} ${c.last_name}`.trim()
        )
        .filter(Boolean)
        .join(", ");
      if (contract.id && names) {
        contractIdToTenantName[contract.id] = names;
      }
    }
  }

  // Resolve tenant names for each document belonging to this local
  const docsForLocal = documentsByLocalId[local_id] ?? [];
  const tenantDocuments = docsForLocal.map((doc) => {
    const contractIdMatch = /_([^_]+)\.pdf$/.exec(doc.document_name);
    const contractId = contractIdMatch?.[1] ?? "";
    const isVacancy = doc.document_name.includes("leerstand");
    const tenantName = isVacancy
      ? "Leerstand"
      : (contractIdToTenantName[contractId] ?? "");
    return { ...doc, tenantName };
  });

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}`}
        title="Detailansicht"
        subtitle="Die fertig erstellten Heizkostenabrechnung können nun die "
      />
      <ContentWrapper className="space-y-4 max-h-[90%]">
        <AdminObjekteLocalItemHeatingBillDocResult
          objektID={objekt_id}
          userID={user_id}
          item={localData}
          docType="localauswahl"
          docID={doc_id}
          tenantDocuments={tenantDocuments}
        />
      </ContentWrapper>
    </div>
  );
}

