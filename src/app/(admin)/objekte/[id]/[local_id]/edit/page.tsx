import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import EditObjekteUnitForm from "@/components/Admin/Forms/Edit/EditObjekteUnitForm";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { getLocalById, getSignedUrlsForObject } from "@/api";

export default async function EditLocalPage({
  params,
}: {
  params: Promise<{ id: string; local_id: string }>;
}) {
  const { id, local_id } = await params;

  const local = await getLocalById(local_id);

  if (!local) {
    return <div>Objekt nicht gefunden</div>;
  }

  const documentFilesUrls = await getSignedUrlsForObject(local_id);

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={ROUTE_OBJEKTE}
        title="Objekte"
      />
      <ContentWrapper className="space-y-4">
        <div className="px-10 py-9 max-medium:px-4 max-medium:py-4 rounded-2xl max-medium:rounded-xl space-y-5 bg-[#FDFDFC]">
          <EditObjekteUnitForm
            objektID={id}
            localID={local_id}
            uploadedDocuments={documentFilesUrls}
            initialValues={{
              apartment_type: local.apartment_type
                ? local.apartment_type
                : null,
              cellar_available: local.cellar_available ?? null,
              floor: local.floor,
              house_fee: Number(local.house_fee),
              house_location: local.house_location ?? null,
              living_space: Number(local.living_space),
              heating_area: local.heating_area ? Number(local.heating_area) : 0,
              outdoor: local.outdoor ?? null,
              outdoor_area: Number(local.outdoor_area),
              residential_area: local.residential_area ?? null,
              rooms: Number(local.rooms),
              heating_systems: Array.isArray(local.heating_systems)
                ? (local.heating_systems as string[])
                : [],
              tags: Array.isArray(local.tags) ? (local.tags as string[]) : [],
              usage_type: local.usage_type,
              documents: [],
            }}
          />
        </div>
      </ContentWrapper>
    </div>
  );
}
