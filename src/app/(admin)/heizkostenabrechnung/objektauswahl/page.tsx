import { getObjekts } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteItemDoc from "@/components/Admin/ObjekteItem/ObjekteItemDoc";
import SearchControls from "@/components/Admin/SearchControls";
import { ROUTE_DASHBOARD, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function LocalPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const { search = "", sort = "asc" } = await searchParams;
  
  let objekts = await getObjekts();
  const totalObjekts = objekts.length;

  // Filter by search query
  if (search.trim()) {
    objekts = objekts.filter((objekt) =>
      objekt.street?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort alphabetically
  objekts.sort((a, b) => {
    const nameA = a.street?.toLowerCase() || "";
    const nameB = b.street?.toLowerCase() || "";
    return sort === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Dashboard"
        link={ROUTE_DASHBOARD}
        title="Auswahl der Objektart"
        subtitle="Für welche Immobilie wollen Sie eine Betriebskostenabrechnung erstellen lassen?"
      />
      <ContentWrapper className="space-y-4 max-medium:space-y-3 grid grid-rows-[1fr_auto] max-h-[90%] max-medium:max-h-none">
        <div className="space-y-4 max-medium:space-y-3">
          <SearchControls
            totalResults={totalObjekts}
            currentResults={objekts.length}
          />
          <div className="overflow-y-auto space-y-4 max-medium:space-y-3">
            {objekts.length === 0 ? (
              <div className="bg-white rounded-2xl max-medium:rounded-xl p-8 max-medium:p-4 text-center">
                <p className="text-dark_green/50 text-lg max-medium:text-base">
                  Keine Ergebnisse gefunden
                </p>
                <p className="text-dark_green/30 text-sm max-medium:text-xs mt-2">
                  Versuchen Sie einen anderen Suchbegriff
                </p>
              </div>
            ) : (
              objekts.map((objekt) => (
                <ObjekteItemDoc
                  docLink={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objekt.id}/abrechnungszeitraum`}
                  key={objekt.id}
                  item={objekt}
                />
              ))
            )}
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
