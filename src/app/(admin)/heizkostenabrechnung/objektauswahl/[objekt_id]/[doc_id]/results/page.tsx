import { getRelatedLocalsByObjektId } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteObjektItemHeatingBillDocResult from "@/components/Admin/ObjekteLocalItem/ObjekteObjektItemHeatingBillDocResult";
import SearchControls from "@/components/Admin/SearchControls";
import { buildLocalName } from "@/utils";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import type { UnitType } from "@/types";
import database from "@/db";
import { heating_bill_documents, contracts, contractors } from "@/db/drizzle/schema";
import { eq, inArray } from "drizzle-orm";

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

  let locals = (await getRelatedLocalsByObjektId(objekt_id)).filter((local) =>
    ALLOWED_HEATING_BILL_USAGE_TYPES.has(local.usage_type as UnitType)
  );
  const totalLocals = locals?.length || 0;

  // Fetch billing period from the heating bill document
  const doc = await database
    .select({
      start_date: heating_bill_documents.start_date,
      end_date: heating_bill_documents.end_date,
    })
    .from(heating_bill_documents)
    .where(eq(heating_bill_documents.id, doc_id))
    .then((r) => r[0] ?? null);

  // Fetch all contracts for the building's locals with their contractors
  const localIds = locals.map((l) => l.id).filter(Boolean) as string[];
  let allContracts: Array<{
    id: string;
    local_id: string | null;
    rental_start_date: string;
    rental_end_date: string | null;
    contractorNames: string;
  }> = [];

  if (localIds.length > 0 && doc?.start_date && doc?.end_date) {
    const periodStart = new Date(doc.start_date);
    const periodEnd = new Date(doc.end_date);

    const contractRows = await database
      .select()
      .from(contracts)
      .where(inArray(contracts.local_id, localIds));

    if (contractRows.length > 0) {
      const contractIds = contractRows.map((c) => c.id);
      const contractorRows = await database
        .select()
        .from(contractors)
        .where(inArray(contractors.contract_id, contractIds));

      const contractorsByContract = new Map<string, typeof contractorRows>();
      for (const ct of contractorRows) {
        const arr = contractorsByContract.get(ct.contract_id) ?? [];
        arr.push(ct);
        contractorsByContract.set(ct.contract_id, arr);
      }

      allContracts = contractRows
        .filter((c) => {
          const cStart = new Date(c.rental_start_date);
          const cEnd = c.rental_end_date ? new Date(c.rental_end_date) : null;
          return cStart <= periodEnd && (!cEnd || cEnd >= periodStart);
        })
        .map((c) => {
          const cts = contractorsByContract.get(c.id) ?? [];
          return {
            id: c.id,
            local_id: c.local_id,
            rental_start_date: c.rental_start_date,
            rental_end_date: c.rental_end_date,
            contractorNames: cts.length > 0
              ? cts.map((ct) => `${ct.first_name} ${ct.last_name}`).join(", ")
              : "Leerstand",
          };
        });
    }
  }

  // Build per-locale tenant map
  const tenantsByLocal = new Map<string, Array<{ contractId: string; contractorsNames: string }>>();
  for (const c of allContracts) {
    if (!c.local_id) continue;
    const existing = tenantsByLocal.get(c.local_id) ?? [];
    existing.push({ contractId: c.id, contractorsNames: c.contractorNames });
    tenantsByLocal.set(c.local_id, existing);
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

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
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
              locals.map((local) => (
                <ObjekteObjektItemHeatingBillDocResult
                  id={objekt_id}
                  key={local.id}
                  item={local}
                  docType="objektauswahl"
                  docID={doc_id}
                  tenants={tenantsByLocal.get(local.id ?? "") ?? undefined}
                />
              ))
            )}
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
