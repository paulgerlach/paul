import { getRelatedLocalsByObjektId } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminObjekteLocalsDoc from "../../../../../../../components/Admin/ObjekteLocalsAccordion/Admin/AdminObjekteLocalsDoc";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { buildLocalName } from "@/utils";

export default async function ObjektDetailsPage({
  params,
}: {
  params: Promise<{ objekt_id: string; user_id: string }>;
}) {
  const { objekt_id, user_id } = await params;

  const relatedLocals = await getRelatedLocalsByObjektId(objekt_id);

  // Sort alphabetically by local name
  relatedLocals.sort((a, b) => {
    const nameA = buildLocalName(a).toLowerCase();
    const nameB = buildLocalName(b).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl`}
        title={`Wohneinheiten`}
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto] max-h-[90%]">
        <AdminObjekteLocalsDoc
          userID={user_id}
          objektID={objekt_id}
          locals={relatedLocals}
        />
      </ContentWrapper>
    </div>
  );
}
