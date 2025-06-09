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
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={ROUTE_OBJEKTE}
        title="Objekte"
      />
      <ContentWrapper className="space-y-4 max-h-[90%]">
        <div className="px-10 py-9 rounded-2xl space-y-5 bg-[#FDFDFC]">
          <EditObjekteUnitForm
            objektID={id}
            localID={local_id}
            uploadedDocuments={documentFilesUrls}
            initialValues={{
              apartment_type: local.apartment_type,
              cellar_available: local.cellar_available,
              floor: local.floor,
              house_fee: Number(local.house_fee),
              house_location: local.house_location,
              living_space: Number(local.living_space),
              outdoor: local.outdoor,
              outdoor_area: Number(local.outdoor_area),
              residential_area: local.residential_area,
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
