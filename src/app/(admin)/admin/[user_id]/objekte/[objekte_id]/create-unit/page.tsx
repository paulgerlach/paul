import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminCreateObjekteUnitForm from "@/components/Admin/Forms/Admin/Create/AdminCreateObjekteUnitForm";
import { ROUTE_ADMIN, ROUTE_OBJEKTE } from "@/routes/routes";

export default async function CreateLocalePage({
  params,
}: {
  params: Promise<{ user_id: string; objekte_id: string }>;
}) {
  const { objekte_id, user_id } = await params;
  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_OBJEKTE}`}
        title={`Detailansicht Einheit`}
      />
      <ContentWrapper className="space-y-4">
        <div className="px-10 py-9 rounded-2xl space-y-5 bg-[#FDFDFC]">
          <AdminCreateObjekteUnitForm objekteID={objekte_id} userID={user_id} />
        </div>
      </ContentWrapper>
    </div>
  );
}
