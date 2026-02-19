import { getRelatedLocalsByObjektId } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminObjekteLocalItemHeatingBillDocResult from "@/components/Admin/ObjekteLocalItem/Admin/AdminObjekteLocalItemHeatingBillDocResult";
import SearchControls from "@/components/Admin/SearchControls";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { buildLocalName } from "@/utils";

export default async function ResultLocalPDF({
  params,
  searchParams,
}: {
  params: Promise<{ objekt_id: string; doc_id: string; user_id: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const { objekt_id, doc_id, user_id } = await params;
  const { search = "", sort = "asc" } = await searchParams;

  let locals = await getRelatedLocalsByObjektId(objekt_id);
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
              locals.map((local) => (
                <AdminObjekteLocalItemHeatingBillDocResult
                  objektID={objekt_id}
                  key={local.id}
                  userID={user_id}
                  item={local}
                  docType="objektauswahl"
                  docID={doc_id}
                />
              ))
            )}
        </div>
      </ContentWrapper>
    </div>
  );
}
