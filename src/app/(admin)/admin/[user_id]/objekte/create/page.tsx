import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminCreateObjekteForm from "@/components/Admin/Forms/Admin/Create/AdminCreateObjekteForm";
import { ROUTE_ADMIN, ROUTE_OBJEKTE } from "@/routes/routes";

export default async function ObjekteCreatePage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;
  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_OBJEKTE}`}
        title="Objekt hinzufügen"
      />
      <ContentWrapper className="space-y-4">
        <div className="px-10 py-9 rounded-2xl space-y-5 bg-[#FDFDFC]">
          <AdminCreateObjekteForm userID={user_id} />
        </div>
      </ContentWrapper>
    </div>
  );
}
