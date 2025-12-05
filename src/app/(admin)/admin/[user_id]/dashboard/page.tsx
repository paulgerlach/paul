import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import DashboardCharts from "@/components/Admin/DashboardCharts/DashboardCharts";

export default async function AdminDashboardPage({ 
  params 
}: { 
  params: Promise<{ user_id: string }> 
}) {
  const { user_id } = await params;
  
  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 overflow-scroll">
      <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
      <DashboardCharts />
    </div>
  );
}
