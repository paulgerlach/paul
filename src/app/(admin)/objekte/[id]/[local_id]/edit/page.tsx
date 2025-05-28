import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import EditObjekteUnitForm from "@/components/Admin/Forms/Edit/EditObjekteUnitForm";
import database from "@/db";
import { documents, locals } from "@/db/drizzle/schema";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { supabaseServer } from "@/utils/supabase/server";
import { and, eq } from "drizzle-orm";

export default async function EditLocalPage({
  params,
}: {
  params: Promise<{ id: string; local_id: string }>;
}) {
  const { id, local_id } = await params;

  // const supabase = await supabaseServer();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   return <div>Unauthorized</div>;
  // }

  const local = await database
    .select()
    .from(locals)
    .where(eq(locals.id, local_id))
    .then((res) => res[0]);

  if (!local) {
    return <div>Objekt nicht gefunden</div>;
  }

  // const userDocuments = await database
  //   .select()
  //   .from(documents)
  //   .where(
  //     and(
  //       eq(documents.user_id, user.id),
  //       eq(documents.related_type, "local"),
  //       eq(documents.related_id, local_id)
  //     )
  //   );

  // const mappedDocuments = userDocuments.map((doc) => ({
  //   id: doc.id,
  //   name: doc.document_name,
  //   url: doc.document_url,
  // }));

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
            initialValues={{
              apartment_type: local.apartment_type,
              cellar_available: local.cellar_available,
              floor: local.floor,
              heating_systems: local.heating_systems,
              house_fee: Number(local.house_fee),
              house_location: local.house_location,
              living_space: Number(local.living_space),
              outdoor: local.outdoor,
              outdoor_area: Number(local.outdoor_area),
              residential_area: local.residential_area,
              rooms: Number(local.rooms),
              tags: local.tags,
              usage_type: local.usage_type,
              documents: [],
            }}
          />
        </div>
      </ContentWrapper>
    </div>
  );
}
