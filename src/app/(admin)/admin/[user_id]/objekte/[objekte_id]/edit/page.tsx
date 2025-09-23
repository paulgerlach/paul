import { getObjectById } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminEditObjekteForm from "@/components/Admin/Forms/Admin/Edit/AdminEditObjekteForm";
import { ROUTE_ADMIN, ROUTE_OBJEKTE } from "@/routes/routes";

export default async function EditObjektePage({
  params,
}: {
  params: Promise<{ objekte_id: string; user_id: string }>;
}) {
  const { objekte_id, user_id } = await params;

  const object = await getObjectById(objekte_id);

  if (!object) {
    return <div>Objekt nicht gefunden</div>;
  }

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_OBJEKTE}`}
        title="Objekte"
      />
      <ContentWrapper className="space-y-4">
        <div className="px-10 py-9 rounded-2xl space-y-5 bg-[#FDFDFC]">
          <AdminEditObjekteForm
            objekteID={objekte_id}
            initialValues={{
              administration_type: object.administration_type,
              hot_water_preparation: object.hot_water_preparation,
              objekt_type: object.objekt_type,
              street: object.street,
              zip: object.zip,
              buildYear: object.build_year ?? null,
              hasElevator: object.has_elevator ?? null,
              landArea: object.land_area || null,
              heating_systems: Array.isArray(object.heating_systems)
                ? (object.heating_systems as string[])
                : [],
              tags: Array.isArray(object.tags) ? (object.tags as string[]) : [],
              livingArea: object.living_area || null,
              usableArea: object.usable_area || null,
              image_url: object.image_url || null,
            }}
          />
        </div>
      </ContentWrapper>
    </div>
  );
}
