import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import { parseCSVs } from "@/api";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";
import ShareButton from "@/app/shared/ShareButton";

export default async function AdminPage() {
  const parsedData = await parseCSVs();

  return (
    <div className="py-6 px-9 overflow-scroll">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
      </div>
      <DashboardCharts parsedData={parsedData!} />
      <div className="mt-6 max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl mx-auto px-4">
        <ShareButton className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300" />
      </div>
    </div>
  );
}
