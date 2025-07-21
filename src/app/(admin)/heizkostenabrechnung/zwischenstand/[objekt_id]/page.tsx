import { getRelatedLocalsByObjektId } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteLocalsDoc from "@/components/Admin/ObjekteLocalsAccordion/ObjekteLocalsDoc";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function ObjektDetailsPage({
  params,
}: {
  params: Promise<{ objekt_id: string }>;
}) {
  const { objekt_id } = await params;

  const relatedLocals = await getRelatedLocalsByObjektId(objekt_id);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/zwischenstand`}
        title={`Wohneinheiten`}
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto] max-h-[90%]">
        <ObjekteLocalsDoc id={objekt_id} locals={relatedLocals} />
      </ContentWrapper>
    </div>
  );
}
