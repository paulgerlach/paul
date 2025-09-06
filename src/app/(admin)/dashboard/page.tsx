import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import { parseCSVs } from "@/api";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";
import ShareButton from "@/app/shared/ShareButton";
import LiveViewToggle from "@/components/Demo/LiveViewToggle";

export default async function AdminPage() {
  const parsedData = await parseCSVs();

  return (
    <div className="py-6 px-9 overflow-scroll">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
          <LiveViewToggle />
        </div>
        <ShareButton />
      </div>
      <DashboardCharts parsedData={parsedData!} />
    </div>
  );
}
