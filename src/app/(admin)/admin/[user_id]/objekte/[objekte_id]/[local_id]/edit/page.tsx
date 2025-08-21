import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { ROUTE_ADMIN, ROUTE_OBJEKTE } from "@/routes/routes";
import {
  getLocalById,
  getMetersByLocalId,
  getSignedUrlsForObject,
} from "@/api";
import AdminEditObjekteUnitForm from "@/components/Admin/Forms/Admin/Edit/AdminEditObjekteUnitForm";

export default async function AdminEditLocalPage({
  params,
}: {
  params: Promise<{ objekte_id: string; local_id: string; user_id: string }>;
}) {
  const { objekte_id, local_id, user_id } = await params;

  const local = await getLocalById(local_id);
  const meters = await getMetersByLocalId(local_id);

  if (!local) {
    return <div>Objekt nicht gefunden</div>;
  }

  const documentFilesUrls = await getSignedUrlsForObject(local_id);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_OBJEKTE}/${objekte_id}`}
        title="Objekte"
      />
      <ContentWrapper className="space-y-4">
        <div className="px-10 py-9 rounded-2xl space-y-5 bg-[#FDFDFC]">
          <AdminEditObjekteUnitForm
            objektID={objekte_id}
            localID={local_id}
            userID={user_id}
            uploadedDocuments={documentFilesUrls}
            initialValues={{
              apartment_type: local.apartment_type
                ? local.apartment_type
                : null,
              id: local_id,
              cellar_available: local.cellar_available ?? null,
              floor: local.floor,
              house_fee: Number(local.house_fee),
              house_location: local.house_location ?? null,
              living_space: Number(local.living_space),
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
              meters: meters.map((meter) => ({
                meter_note: meter.meter_note ?? null,
                meter_number: meter.meter_number ?? null,
                meter_type: meter.meter_type ?? null,
              })),
            }}
          />
        </div>
      </ContentWrapper>
    </div>
  );
}
