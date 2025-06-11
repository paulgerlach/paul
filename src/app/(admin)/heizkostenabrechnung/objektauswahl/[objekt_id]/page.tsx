import { getRelatedLocalsByObjektId } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteLocalsAccordionDoc from "@/components/Admin/ObjekteLocalsAccordion/ObjekteLocalsAccordionDoc";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function ObjektDetailsPage({
  params,
}: {
  params: Promise<{ objekt_id: string }>;
}) {
  const { objekt_id } = await params;

  const relatedLocals = await getRelatedLocalsByObjektId(objekt_id);

  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Objekte"
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl`}
        title={`Wohneinheiten`}
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto] max-h-[90%]">
        <ObjekteLocalsAccordionDoc id={objekt_id} locals={relatedLocals} />
      </ContentWrapper>
    </div>
  );
}
