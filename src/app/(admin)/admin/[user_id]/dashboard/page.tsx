import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";

export default function AdminDashboardPage() {
  return (
    <div className="py-6 px-9 overflow-scroll">
      <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
      <DashboardCharts />
    </div>
  );
}
