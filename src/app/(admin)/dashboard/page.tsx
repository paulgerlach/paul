import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import GaugeChart from "@/components/Basic/Charts/GaugeChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import NotificationsChart from "@/components/Basic/Charts/NotificationsChart";
import WaterChart from "@/components/Basic/Charts/WaterChart";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import fs from "fs";
import path from "path";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
// import { parseCSV } from "@/api";

export default async function AdminPage() {
  const coldWaterPath = path.resolve(
    process.cwd(),
    "public/data/Cold_Water_Meter_Data.csv"
  );
  const coldWaterText = fs.readFileSync(coldWaterPath, "utf8");
  const hotWaterPath = path.resolve(
    process.cwd(),
    "public/data/Warm_Water_Meter_Data.csv"
  );
  const hotWaterText = fs.readFileSync(hotWaterPath, "utf8");
  const heatersPath = path.resolve(
    process.cwd(),
    "public/data/Heat_Meter_Data.csv"
  );
  const heatersText = fs.readFileSync(heatersPath, "utf8");


  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
      <ContentWrapper className="max-h-[90%] grid grid-cols-3 gap-2 grid-rows-10">
        <WaterChart
          csvText={coldWaterText}
          color="#6083CC"
          title="Kaltwasser"
          chartType="cold"
        />
        <GaugeChart />
        <NotificationsChart />
        <HeatingCosts csvText={heatersText} />
        <WaterChart
          csvText={hotWaterText}
          color="#E74B3C"
          title="Warmwasser"
          chartType="hot"
        />
        <EinsparungChart />
      </ContentWrapper>
    </div>
  );
}
