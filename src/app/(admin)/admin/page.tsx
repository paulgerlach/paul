import { getUsers } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminUserItem from "@/components/Admin/ObjekteItem/AdminUserItem";
import RegistrationToggle from "@/components/Admin/RegistrationToggle/RegistrationToggle";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export default async function AdminPage() {
  const users = await getUsers();

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={ROUTE_OBJEKTE}
        title="User Übersicht"
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto]">
        <div className="overflow-y-auto space-y-4">
          {/* Registration Control */}
          <RegistrationToggle />
          
          {/* User List */}
          <div className="pt-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Benutzer</h2>
            {users.map((user) => (
              <AdminUserItem key={user.id} item={user} />
            ))}
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
