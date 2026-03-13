import {
  getRelatedLocalsByObjektId,
  getDocumentsByHeatingBillDocId,
  getContractsWithContractorsByLocalID,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteObjektItemHeatingBillDocResult from "@/components/Admin/ObjekteLocalItem/ObjekteObjektItemHeatingBillDocResult";
import SearchControls from "@/components/Admin/SearchControls";
import { buildLocalName } from "@/utils";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import type { UnitType } from "@/types";
import HeatingBillPDFPendingModal from "@/components/Admin/Docs/HeatingBillPDFPendingModal/HeatingBillPDFPendingModal";
import { supabaseServer } from "@/utils/supabase/server";
import database from "@/db";
import { users, heating_bill_documents } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

const ALLOWED_HEATING_BILL_USAGE_TYPES = new Set<UnitType>([
  "residential",
  "commercial",
]);

export default async function ResultLocalPDF({
  params,
  searchParams,
}: {
  params: Promise<{ objekt_id: string; doc_id: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const { objekt_id, doc_id } = await params;
  const { search = "", sort = "asc" } = await searchParams;

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

  let pendingTooltip = "";
  if (isPdfPending && hbDoc?.created_at) {
    const remainingMs = new Date(hbDoc.created_at).getTime() + 24 * 60 * 60 * 1000 - Date.now();
    if (remainingMs > 0) {
      pendingTooltip = "Heizkostenabrechnung wird hergestellt. Dies dauert in der Regel 24h. Wir benachrichtigen Sie per Email.";
    }
  }

  let locals = (await getRelatedLocalsByObjektId(objekt_id)).filter((local) =>
    ALLOWED_HEATING_BILL_USAGE_TYPES.has(local.usage_type as UnitType)
  );
  const totalLocals = locals?.length || 0;

  // Fetch tenant documents linked directly to this heating bill doc
  const documentsByLocalId = await getDocumentsByHeatingBillDocId(doc_id);

  // Fetch contracts for tenant name resolution
  const localIds = locals.map((l) => l.id).filter((id): id is string => Boolean(id));
  const contractsByLocalId: Record<string, Awaited<ReturnType<typeof getContractsWithContractorsByLocalID>>> = {};
  if (localIds.length > 0) {
    const results = await Promise.all(
      localIds.map(async (id) => ({
        id,
        contracts: await getContractsWithContractorsByLocalID(id),
      }))
    );
    for (const { id, contracts: c } of results) {
      contractsByLocalId[id] = c;
    }
  }

  // Build a contract_id → tenant name map
  const contractIdToTenantName: Record<string, string> = {};
  for (const localContracts of Object.values(contractsByLocalId)) {
    if (!localContracts) continue;
    for (const contract of localContracts) {
      const names = contract.contractors
        ?.map((c: { first_name: string; last_name: string }) => `${c.first_name} ${c.last_name}`.trim())
        .filter(Boolean)
        .join(", ");
      if (contract.id && names) {
        contractIdToTenantName[contract.id] = names;
      }
    }
  }

  // Resolve tenant names for each document
  const tenantDocsByLocalId: Record<
    string,
    { id: string; document_name: string; document_url: string; tenantName: string; current_document: boolean; created_at: string }[]
  > = {};
  for (const [localId, docs] of Object.entries(documentsByLocalId)) {
    const validDocs = docs.filter(doc => doc.current_document !== false);
    tenantDocsByLocalId[localId] = validDocs.map((doc) => {
      // Matches `_contractId.pdf` or `_contractId_v12345.pdf`
      const contractIdMatch = /_([^_]+)(?:_v\d+)?\.pdf$/.exec(doc.document_name);
      const contractId = contractIdMatch?.[1] ?? "";
      const isVacancy = doc.document_name.toLowerCase().includes("leerstand");
      const tenantName = isVacancy ? "Leerstand" : (contractIdToTenantName[contractId] ?? "");
      return { ...doc, tenantName };
    });
  }

  // Filter by search query
  if (search.trim() && locals) {
    locals = locals.filter((local) => {
      const localName = buildLocalName(local).toLowerCase();
      return localName.includes(search.toLowerCase());
    });
  }

  // Sort alphabetically
  if (locals) {
    locals.sort((a, b) => {
      const nameA = buildLocalName(a).toLowerCase();
      const nameB = buildLocalName(b).toLowerCase();
      return sort === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }

  // Determine status per locale
  const localsWithStatus = locals.map((local) => {
    const localId = local.id ?? "";
    const localContracts = contractsByLocalId[localId] ?? [];
    const status = localContracts.some((c) => c.is_current)
      ? "renting"
      : "vacancy";
    return { local, status } as const;
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
        <div className="space-y-4">
          <SearchControls
            totalResults={totalLocals}
            currentResults={locals?.length || 0}
          />
          <div className="overflow-y-auto space-y-4">
            {!locals || locals.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <p className="text-dark_green/50 text-lg">
                  Keine Ergebnisse gefunden
                </p>
                <p className="text-dark_green/30 text-sm mt-2">
                  Versuchen Sie einen anderen Suchbegriff
                </p>
              </div>
            ) : (
              localsWithStatus.map(({ local, status }) => (
                <ObjekteObjektItemHeatingBillDocResult
                  objektID={objekt_id}
                  key={local.id}
                  item={local}
                  docType="objektauswahl"
                  docID={doc_id}
                  status={status}
                  tenantDocuments={isPdfPending ? [] : (tenantDocsByLocalId[local.id ?? ""] ?? [])}
                  isPending={isPdfPending}
                  pendingTooltip={pendingTooltip}
                />
              ))
            )}
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
