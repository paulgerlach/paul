import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import { parseCSVs } from "@/api";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";

export default async function AdminDashboardPage() {
  const parsedData = await parseCSVs();

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
      <DashboardCharts parsedData={parsedData!} />
    </div>
  );
}
