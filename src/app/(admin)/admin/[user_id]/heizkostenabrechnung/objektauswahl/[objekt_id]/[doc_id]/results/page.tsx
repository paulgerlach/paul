import {
  getAdminContractsWithContractorsByLocalIDs,
  getRelatedLocalsByObjektId,
  getDocumentsByHeatingBillDocId,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminObjekteLocalItemHeatingBillDocResult from "@/components/Admin/ObjekteLocalItem/Admin/AdminObjekteLocalItemHeatingBillDocResult";
import SearchControls from "@/components/Admin/SearchControls";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { buildLocalName } from "@/utils";
import type { UnitType } from "@/types";
import { supabaseServer } from "@/utils/supabase/server";
import database from "@/db";
import { users } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

const ALLOWED_HEATING_BILL_USAGE_TYPES = new Set<UnitType>([
  "residential",
  "commercial",
]);

export default async function ResultLocalPDF({
  params,
  searchParams,
}: {
  params: Promise<{ objekt_id: string; doc_id: string; user_id: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const { objekt_id, doc_id, user_id } = await params;
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

  let locals = (await getRelatedLocalsByObjektId(objekt_id)).filter((local) =>
    ALLOWED_HEATING_BILL_USAGE_TYPES.has(local.usage_type as UnitType)
  );
  const totalLocals = locals.length;

  // Filter by search query
  if (search.trim()) {
    locals = locals.filter((local) =>
      buildLocalName(local).toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort alphabetically
  locals.sort((a, b) => {
    const nameA = buildLocalName(a).toLowerCase();
    const nameB = buildLocalName(b).toLowerCase();
    return sort === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });
  const contractsByLocalId = await getAdminContractsWithContractorsByLocalIDs(
    locals.map((local) => local.id).filter((id): id is string => Boolean(id)),
    user_id
  );

  // Fetch tenant documents linked directly to this heating bill doc
  const documentsByLocalId = await getDocumentsByHeatingBillDocId(doc_id);

  // Build a contract_id → tenant name map from the already-fetched contracts
  const contractIdToTenantName: Record<string, string> = {};
  for (const localContracts of Object.values(contractsByLocalId)) {
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
    { id: string; document_name: string; document_url: string; current_document: boolean; tenantName: string }[]
  > = {};
  for (const [localId, docs] of Object.entries(documentsByLocalId)) {
    const validDocsForLocal = isSuperAdmin ? docs : docs.filter(doc => doc.current_document !== false);

    tenantDocsByLocalId[localId] = validDocsForLocal.map((doc) => {
      const contractIdMatch = /_([^_]+)\.pdf$/.exec(doc.document_name);
      const contractId = contractIdMatch?.[1] ?? "";
      const isVacancy = doc.document_name.includes("leerstand");
      const tenantName = isVacancy ? "Leerstand" : (contractIdToTenantName[contractId] ?? "");
      return { ...doc, tenantName };
    });
  }

  const localsWithStatus = locals.map((local) => {
    const localId = local.id ?? "";
    const contracts = contractsByLocalId[localId] ?? [];
    const status = contracts.some((contract) => contract.is_current)
      ? "renting"
      : "vacancy";
    return { local, status } as const;
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
        <SearchControls
          totalResults={totalLocals}
          currentResults={locals.length}
        />
        <div className="overflow-y-auto space-y-4">
          {locals.length === 0 ? (
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
              <AdminObjekteLocalItemHeatingBillDocResult
                objektID={objekt_id}
                key={local.id}
                userID={user_id}
                item={local}
                docType="objektauswahl"
                docID={doc_id}
                status={status}
                tenantDocuments={tenantDocsByLocalId[local.id ?? ""] ?? []}
                isSuperAdmin={isSuperAdmin}
              />
            ))
          )}
        </div>
      </ContentWrapper>
    </div>
  );
}
