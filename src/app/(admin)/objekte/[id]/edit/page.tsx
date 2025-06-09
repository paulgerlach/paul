import { getObjectById } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import EditObjekteForm from "@/components/Admin/Forms/Edit/EditObjekteForm";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export default async function EditObjektePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const object = await getObjectById(id);

  if (!object) {
    return <div>Objekt nicht gefunden</div>;
  }

  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={ROUTE_OBJEKTE}
        title="Objekte"
      />
      <ContentWrapper className="space-y-4 max-h-[90%]">
        <div className="px-10 py-9 rounded-2xl space-y-5 bg-[#FDFDFC]">
          <EditObjekteForm
            objekteID={id}
            initialValues={{
              administration_type: object.administration_type,
              hot_water_preparation: object.hot_water_preparation,
              objekt_type: object.objekt_type,
              street: object.street,
              zip: object.zip,
              buildYear: object.build_year,
              hasElevator: object.has_elevator,
              landArea: object.land_area || null,
              heating_systems: Array.isArray(object.heating_systems)
                ? (object.heating_systems as string[])
                : [],
              tags: Array.isArray(object.tags) ? (object.tags as string[]) : [],
              livingArea: object.living_area || null,
              usableArea: object.usable_area || null,
            }}
          />
        </div>
      </ContentWrapper>
    </div>
  );
}
