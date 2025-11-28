import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";
import ShareButton from "@/app/shared/ShareButton";

export default function AdminPage() {
  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 space-y-6 overflow-y-auto flex-1">
      <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
      <DashboardCharts />
      <ShareButton />
    </div>
  );
}
