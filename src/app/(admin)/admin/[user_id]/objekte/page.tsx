import { getObjektsByUserID } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminObjekteItem from "@/components/Admin/ObjekteItem/AdminObjekteItem";
import SearchControls from "@/components/Admin/SearchControls";
import { buildSubRoute } from "@/lib/navigation";
import { ROUTE_ADMIN } from "@/routes/routes";
import { objekte } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default async function UserObjektsPage({
  params,
  searchParams,
}: {
  params: Promise<{ user_id: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const { user_id } = await params;
  const { search = "", sort = "asc" } = await searchParams;
  
  let objekts = await getObjektsByUserID(user_id);
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

  const createLink = await buildSubRoute("create");

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 flex-1 overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb backTitle="Users" link={ROUTE_ADMIN} title="User Übersicht" />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto]">
        <div className="space-y-4">
          <SearchControls
            totalResults={totalObjekts}
            currentResults={objekts.length}
          />
          <div className="overflow-y-auto space-y-4">
            {objekts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 max-medium:p-4 text-center">
                <p className="text-dark_green/50 text-lg max-medium:text-base">
                  Keine Ergebnisse gefunden
                </p>
                <p className="text-dark_green/30 text-sm max-medium:text-xs mt-2">
                  Versuchen Sie einen anderen Suchbegriff
                </p>
              </div>
            ) : (
              objekts.map((objekt) => (
                <AdminObjekteItem key={objekt.id} item={objekt} />
              ))
            )}
          </div>
        </div>
        <Link
          href={createLink}
          className="border-dashed w-full max-xl:text-base max-medium:text-sm flex p-5 max-medium:p-3 flex-col items-center justify-center text-xl text-dark_green/50 border border-dark_green rounded-2xl max-medium:rounded-xl"
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-7 opacity-50 max-h-7 max-xl:max-w-5 max-xl:max-h-5 max-medium:max-w-4 max-medium:max-h-4"
            src={objekte}
            alt="objekte"
          />
          Weiteres Objekt hinzufügen
        </Link>
      </ContentWrapper>
    </div>
  );
}
