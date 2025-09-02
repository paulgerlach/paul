import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import GaugeChart from "@/components/Basic/Charts/GaugeChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import NotificationsChart from "@/components/Basic/Charts/NotificationsChart";
import WaterChart from "@/components/Basic/Charts/WaterChart";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { parseCSV } from "@/api";

export default async function AdminPage() {
  const data = await parseCSV();
  const filteredData = data?.filter(
    (item) => item["Device Type"] !== "Device Type"
  );
  const heatDevices = filteredData?.filter(
    (item) => item["Device Type"] === "Heat"
  );
  const coldWaterDevices = filteredData?.filter(
    (item) => item["Device Type"] === "Water"
  );
  const hotWaterDevices = filteredData?.filter(
    (item) => item["Device Type"] === "WWater"
  );

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
      <ContentWrapper className="grid grid-cols-3 gap-2 grid-rows-10">
        <WaterChart
          csvText={coldWaterDevices}
          color="#6083CC"
          title="Kaltwasser"
          chartType="cold"
        />
        <GaugeChart />
        <NotificationsChart />
        <HeatingCosts csvText={heatDevices} />
        <WaterChart
          csvText={hotWaterDevices}
          color="#E74B3C"
          title="Warmwasser"
          chartType="hot"
        />
        <EinsparungChart />
      </ContentWrapper>
    </div>
  );
}
