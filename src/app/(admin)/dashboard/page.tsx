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
    <div className="py-6 px-9 overflow-scroll">
      <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
      <ContentWrapper className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        <div className="flex flex-col gap-3">
          <div className="h-[280px]">
            <WaterChart
              csvText={coldWaterDevices}
              color="#6083CC"
              title="Kaltwasser"
              chartType="cold"
            />
          </div>
          <div className="h-[280px]">
            <WaterChart
              csvText={hotWaterDevices}
              color="#E74B3C"
              title="Warmwasser"
              chartType="hot"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-[265px]">
            <GaugeChart />
          </div>
          <div className="h-[380px]">
            <HeatingCosts csvText={heatDevices} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-[420px]">
            <NotificationsChart />
          </div>
          <div className="h-[140px]">
            <EinsparungChart />
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
