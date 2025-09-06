import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import { parseCSVs } from "@/api";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";
import LiveViewToggle from "@/components/Demo/LiveViewToggle";

export default async function AdminDashboardPage() {
  const parsedData = await parseCSVs();

  return (
    <div className="py-6 px-9 overflow-scroll">
      <div className="flex items-center gap-4 mb-6">
        <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
        <LiveViewToggle />
      </div>
      <DashboardCharts parsedData={parsedData!} />
    </div>
  );
}
