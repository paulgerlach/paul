import EinsparungChart from "@/components/Basic/Charts/EinsparungChart";
import GaugeChart from "@/components/Basic/Charts/GaugeChart";
import HeatingCosts from "@/components/Basic/Charts/HeatingCosts";
import NotificationsChart from "@/components/Basic/Charts/NotificationsChart";
import WaterChart from "@/components/Basic/Charts/WaterChart";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { breadcrum_arrow } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default async function AdminPage() {
  return (
    <div className="py-3 px-5 h-[calc(100dvh-81px)] max-h-[calc(100dvh-81px)]">
      <Link
        className="flex items-center text-black/50 text-sm justify-start gap-2"
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
