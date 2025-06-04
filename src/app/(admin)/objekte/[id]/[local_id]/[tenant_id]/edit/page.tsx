import { getSignedUrlsForObject } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import EditTenantForm from "@/components/Admin/Forms/Edit/EditTenantForm";
import database from "@/db";
import { tenants } from "@/db/drizzle/schema";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { supabaseServer } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";

export default async function EditTenantPage({
  params,
}: {
  params: Promise<{ id: string; local_id: string; tenant_id: string }>;
}) {
  const { id, local_id, tenant_id } = await params;

  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const tenant = await database
    .select()
    .from(tenants)
    .where(eq(tenants.id, tenant_id))
    .then((res) => res[0]);

  if (!tenant) {
    return <div>Tenant nicht gefunden</div>;
  }

  const documentFilesUrls = await getSignedUrlsForObject(tenant_id);

  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={`${ROUTE_OBJEKTE}/${local_id}`}
        title="Objekte"
      />
      <ContentWrapper className="space-y-4 max-h-[90%]">
        <div className="px-10 py-9 rounded-2xl space-y-5 bg-[#FDFDFC]">
          <EditTenantForm
            id={id}
            tenantID={tenant_id}
            localID={local_id}
            uploadedDocuments={documentFilesUrls}
            initialValues={{
              is_current: tenant.is_current,
              additional_costs: Number(tenant.additional_costs),
              birth_date: tenant.birth_date
                ? new Date(tenant.birth_date)
                : new Date(),
              cold_rent: Number(tenant.cold_rent),
              deposit: Number(tenant.deposit),
              email: tenant.email ?? "",
              first_name: tenant.first_name,
              last_name: tenant.last_name,
              phone: tenant.phone ?? "",
              rental_end_date: tenant.rental_end_date
                ? new Date(tenant.rental_end_date)
                : new Date(),
              rental_start_date: tenant.rental_start_date
                ? new Date(tenant.rental_start_date)
                : new Date(),
              custody_type: tenant.custody_type,
              documents: [],
            }}
          />
        </div>
      </ContentWrapper>
    </div>
  );
}
