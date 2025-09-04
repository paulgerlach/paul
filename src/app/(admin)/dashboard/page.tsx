import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import { parseCSVs } from "@/api";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";
import ResetFiltersBar from "@/components/Admin/DashboardCharts/ResetFiltersBar";

export default async function AdminPage() {
  const parsedData = await parseCSVs();

  return (
    <div className="py-6 px-9 overflow-scroll">
      <div className="flex items-end justify-between">
        <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
        <ResetFiltersBar />
      </div>
      <DashboardCharts parsedData={parsedData!} />
    </div>
  );
}
