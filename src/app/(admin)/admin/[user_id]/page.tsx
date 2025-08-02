import { getObjektsByUserID } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminObjekteItem from "@/components/Admin/ObjekteItem/AdminObjekteItem";
import { ROUTE_ADMIN } from "@/routes/routes";

export default async function UserObjektsPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;
  const objekts = await getObjektsByUserID(user_id);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb backTitle="Users" link={ROUTE_ADMIN} title="User Übersicht" />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto]">
        <div className="overflow-y-auto space-y-4">
          {objekts.map((objekt) => (
            <AdminObjekteItem userID={user_id} key={objekt.id} item={objekt} />
          ))}
        </div>
      </ContentWrapper>
    </div>
  );
}
