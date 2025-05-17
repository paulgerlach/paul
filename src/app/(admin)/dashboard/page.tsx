// import { fetchCsvData } from "@/api";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import GaugeChart from "@/components/Basic/Charts/GaugeChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import NotificationsChart from "@/components/Basic/Charts/NotificationsChart";
import WaterChart from "@/components/Basic/Charts/WaterChart";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { breadcrum_arrow } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";

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
      <Link
        className="flex items-center w-fit text-black/50 text-sm justify-start gap-2"
        href={ROUTE_OBJEKTE}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-5 max-h-5"
          src={breadcrum_arrow}
          alt="breadcrum_arrow"
        />
        Objekte
      </Link>
      <h1 className="mb-4 text-lg">Dashboard</h1>
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
