import { getUsers } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminUserItem from "@/components/Admin/ObjekteItem/AdminUserItem";
import RegistrationToggle from "@/components/Admin/RegistrationToggle/RegistrationToggle";
import { ROUTE_OBJEKTE, ROUTE_TOUR_DASHBOARD } from "@/routes/routes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/utils/supabase/server";

export default async function AdminPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("users")
      .select("has_seen_tour")
      .eq("id", user.id)
      .single();

    if (data && !data.has_seen_tour) {
      redirect(ROUTE_TOUR_DASHBOARD);
    }
  }

  const users = await getUsers();

  // Sort alphabetically by email
  users.sort((a, b) => {
    const emailA = a.email?.toLowerCase() || '';
    const emailB = b.email?.toLowerCase() || '';
    return emailA.localeCompare(emailB);
  });

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={ROUTE_OBJEKTE}
        title="User Übersicht"
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto]">
        <div className="overflow-y-auto space-y-4 max-medium:space-y-3">
          {/* Registration Control */}
          <RegistrationToggle />

          {/* User List */}
          <div className="pt-4 max-medium:pt-2">
            <h2 className="text-xl max-medium:text-lg font-semibold text-gray-900 mb-4 max-medium:mb-3">
              Benutzer
            </h2>
            <div className="space-y-3 max-medium:space-y-2">
              {users.map((user) => (
                <AdminUserItem key={user.id} item={user} />
              ))}
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
