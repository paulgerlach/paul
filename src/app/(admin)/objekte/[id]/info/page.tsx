import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import InfoObjekteForm from "@/components/Admin/Forms/Info/InfoObjekteForm";
import database from "@/db";
import { objekte } from "@/db/drizzle/schema";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { eq } from "drizzle-orm";

export default async function ObjekteInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const object = await database
    .select()
    .from(objekte)
    .where(eq(objekte.id, id))
    .then((res) => res[0]);

  if (!object) {
    return <div>Objekt nicht gefunden</div>;
  }
  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={ROUTE_OBJEKTE}
        title="Objekte | "
      />
      <ContentWrapper className="space-y-4 max-h-[90%]">
        <div className="px-10 py-9 rounded-2xl space-y-5 bg-[#FDFDFC]">
          <InfoObjekteForm
            initialValues={{
              administration_type: object.administration_type,
              hot_water_preparation: object.hot_water_preparation,
              heating_systems: object.heating_systems,
              objekt_type: object.objekt_type,
              street: object.street,
              zip: object.zip,
              buildYear: object.build_year,
              hasElevator: object.has_elevator,
              landArea: object.land_area || null,
              tags: object.tags || [],
              livingArea: object.living_area || null,
              usableArea: object.usable_area || null,
            }}
          />
        </div>
      </ContentWrapper>
    </div>
  );
}
