import { getRelatedLocalsByObjektId } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteLocalsAccordion from "@/components/Admin/ObjekteLocalsAccordion/ObjekteLocalsAccordion";
import { ROUTE_ADMIN } from "@/routes/routes";

export default async function AdminObjektDetailsPage({
  params,
}: {
  params: Promise<{ objekte_id: string }>;
}) {
  const { objekte_id } = await params;

  const relatedLocals = await getRelatedLocalsByObjektId(objekte_id);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={ROUTE_ADMIN}
        title={`Wohneinheiten`}
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto]">
        <ObjekteLocalsAccordion id={objekte_id} locals={relatedLocals} />
      </ContentWrapper>
    </div>
  );
}
