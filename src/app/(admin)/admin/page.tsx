import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import GaugeChart from "@/components/Basic/Charts/GaugeChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import NotificationsChart from "@/components/Basic/Charts/NotificationsChart";
import WaterChart from "@/components/Basic/Charts/WaterChart";

export default function AdminPage() {
  return (
    <div className="p-9 h-[calc(100dvh-81px)] max-h-[calc(100dvh-81px)]">
      <h1 className="mb-4">Dashboard</h1>
      <div className="max-w-7xl max-h-[90%] mx-auto rounded-2xl px-3.5 py-4 bg-[#EFEEEC] grid grid-cols-3 gap-2 grid-rows-10">
        <WaterChart color="#6083CC" title="Kaltwasser" chartType="cold" />
        <GaugeChart />
        <NotificationsChart />
        <HeatingCosts />
        <WaterChart color="#E74B3C" title="Warmwasser" chartType="hot" />
        <EinsparungChart />
      </div>
    </div>
  );
}
