import {
  getLocalById,
  getDocumentsByHeatingBillDocId,
  getContractsWithContractorsByLocalID,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteLocalItemHeatingBillDocResult from "@/components/Admin/ObjekteLocalItem/ObjekteLocalItemHeatingBillDocResult";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import HeatingBillPDFPendingModal from "@/components/Admin/Docs/HeatingBillPDFPendingModal/HeatingBillPDFPendingModal";
import { supabaseServer } from "@/utils/supabase/server";
import database from "@/db";
import { users, heating_bill_documents } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function ResultLocalPDF({
  params,
}: {
  params: Promise<{ objekt_id: string; local_id: string; doc_id: string }>;
}) {
  const { objekt_id, local_id, doc_id } = await params;

  const supabase = await supabaseServer();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  let isSuperAdmin = false;
  if (currentUser) {
    const [userData] = await database
      .select({ permission: users.permission })
      .from(users)
      .where(eq(users.id, currentUser.id));
    isSuperAdmin = userData?.permission === "super_admin";
  }

  const [hbDoc] = await database
    .select({ created_at: heating_bill_documents.created_at })
    .from(heating_bill_documents)
    .where(eq(heating_bill_documents.id, doc_id));
  const isPdfPending = !isSuperAdmin && !!hbDoc?.created_at &&
    new Date(hbDoc.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [localData, documentsByLocalId, contracts] = await Promise.all([
    getLocalById(local_id),
    getDocumentsByHeatingBillDocId(doc_id),
    getContractsWithContractorsByLocalID(local_id),
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
  const validDocs = docsForLocal.filter(doc => doc.current_document !== false);
  const tenantDocuments = validDocs.map((doc) => {
    // Matches `_contractId.pdf` or `_contractId_v12345.pdf`
    const contractIdMatch = /_([^_]+)(?:_v\d+)?\.pdf$/.exec(doc.document_name);
    const contractId = contractIdMatch?.[1] ?? "";
    const isVacancy = doc.document_name.toLowerCase().includes("leerstand");
    const tenantName = isVacancy
      ? "Leerstand"
      : (contractIdToTenantName[contractId] ?? "");
    return { ...doc, tenantName };
  });

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <HeatingBillPDFPendingModal isOpen={isPdfPending} />
      <Breadcrumb
        backTitle="Objekte"
        link={ROUTE_HEIZKOSTENABRECHNUNG}
        title="Detailansicht"
        subtitle="Die fertig erstellten Heizkostenabrechnung können nun die "
      />
      <ContentWrapper className="space-y-4 max-h-[90%]">
        <ObjekteLocalItemHeatingBillDocResult
          id={objekt_id}
          item={localData}
          docID={doc_id}
          docType="localauswahl"
          tenantDocuments={isPdfPending ? [] : tenantDocuments}
        />
      </ContentWrapper>
    </div>
  );
}
