"use client";

import dynamic from "next/dynamic";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ChartCardSkeleton from "@/components/Basic/ui/ChartCardSkeleton";
import { type MeterReadingType } from "@/api";

const WaterChart = dynamic(
  () => import("@/components/Basic/Charts/WaterChart"),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const ElectricityChart = dynamic(
  () => import("@/components/Basic/Charts/ElectricityChart"),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const HeatingCosts = dynamic(
  () => import("@/components/Basic/Charts/HeatingCosts"),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const NotificationsChart = dynamic(
  () => import("@/components/Basic/Charts/NotificationsChart"),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const EinsparungChart = dynamic(
  () => import("@/components/Basic/Charts/EinsparungChart"),
  {
    loading: () => <ChartCardSkeleton />,
    ssr: false,
  }
);

const coldWaterDemoData: MeterReadingType[] = [
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "CW001",
    Version: "1.0",
    "Device Type": "Water",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "CW001",
    "Actual Date": "01.01.2024",
    "Actual Volume": 150,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "CW001",
    Version: "1.0",
    "Device Type": "Water",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "CW001",
    "Actual Date": "01.02.2024",
    "Actual Volume": 145,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "CW001",
    Version: "1.0",
    "Device Type": "Water",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "CW001",
    "Actual Date": "01.03.2024",
    "Actual Volume": 140,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "CW001",
    Version: "1.0",
    "Device Type": "Water",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "CW001",
    "Actual Date": "01.04.2024",
    "Actual Volume": 138,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "CW001",
    Version: "1.0",
    "Device Type": "Water",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "CW001",
    "Actual Date": "01.05.2024",
    "Actual Volume": 142,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "CW001",
    Version: "1.0",
    "Device Type": "Water",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "CW001",
    "Actual Date": "01.06.2024",
    "Actual Volume": 148,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
];

const hotWaterDemoData: MeterReadingType[] = [
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HW001",
    Version: "1.0",
    "Device Type": "WWater",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HW001",
    "Actual Date": "01.01.2024",
    "Actual Volume": 80,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HW001",
    Version: "1.0",
    "Device Type": "WWater",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HW001",
    "Actual Date": "01.02.2024",
    "Actual Volume": 75,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HW001",
    Version: "1.0",
    "Device Type": "WWater",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HW001",
    "Actual Date": "01.03.2024",
    "Actual Volume": 72,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HW001",
    Version: "1.0",
    "Device Type": "WWater",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HW001",
    "Actual Date": "01.04.2024",
    "Actual Volume": 68,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HW001",
    Version: "1.0",
    "Device Type": "WWater",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HW001",
    "Actual Date": "01.05.2024",
    "Actual Volume": 70,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HW001",
    Version: "1.0",
    "Device Type": "WWater",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HW001",
    "Actual Date": "01.06.2024",
    "Actual Volume": 74,
    "Actual Unit Volume": "m³",
    "Telegram Type": "EFE_WaterStar M",
  },
];

const electricityDemoData: MeterReadingType[] = [
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "EL001",
    Version: "1.0",
    "Device Type": "Elec",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "EL001",
    "Actual Date": "01.01.2024",
    "Actual Energy / HCA": 250000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "EL001",
    Version: "1.0",
    "Device Type": "Elec",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "EL001",
    "Actual Date": "01.02.2024",
    "Actual Energy / HCA": 240000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "EL001",
    Version: "1.0",
    "Device Type": "Elec",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "EL001",
    "Actual Date": "01.03.2024",
    "Actual Energy / HCA": 235000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "EL001",
    Version: "1.0",
    "Device Type": "Elec",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "EL001",
    "Actual Date": "01.04.2024",
    "Actual Energy / HCA": 230000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "EL001",
    Version: "1.0",
    "Device Type": "Elec",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "EL001",
    "Actual Date": "01.05.2024",
    "Actual Energy / HCA": 238000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "EL001",
    Version: "1.0",
    "Device Type": "Elec",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "EL001",
    "Actual Date": "01.06.2024",
    "Actual Energy / HCA": 245000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
];

const heatingDemoData: MeterReadingType[] = [
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HT001",
    Version: "1.0",
    "Device Type": "Heat",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HT001",
    "Actual Date": "01.01.2024",
    "Actual Energy / HCA": 180000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HT001",
    Version: "1.0",
    "Device Type": "Heat",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HT001",
    "Actual Date": "01.02.2024",
    "Actual Energy / HCA": 170000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HT001",
    Version: "1.0",
    "Device Type": "Heat",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HT001",
    "Actual Date": "01.03.2024",
    "Actual Energy / HCA": 160000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HT001",
    Version: "1.0",
    "Device Type": "Heat",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HT001",
    "Actual Date": "01.04.2024",
    "Actual Energy / HCA": 155000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HT001",
    Version: "1.0",
    "Device Type": "Heat",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HT001",
    "Actual Date": "01.05.2024",
    "Actual Energy / HCA": 165000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "HT001",
    Version: "1.0",
    "Device Type": "Heat",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "HT001",
    "Actual Date": "01.06.2024",
    "Actual Energy / HCA": 175000,
    "Actual Unit": "Wh",
    "Telegram Type": "EMH",
  },
];

const notificationsDemoData: MeterReadingType[] = [
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "NT001",
    Version: "1.0",
    "Device Type": "Water",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "NT001",
    "Actual Date": "15.01.2024",
    "Actual Volume": 200,
    "Actual Unit Volume": "m³",
    "Hint Code": 5,
    "Hint Code Description": "High consumption",
    "RSSI Value": -85,
    "Telegram Type": "EFE_WaterStar M",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "NT002",
    Version: "1.0",
    "Device Type": "Heat",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "NT002",
    "Actual Date": "20.02.2024",
    "Actual Energy / HCA": 150000,
    "Actual Unit": "Wh",
    "Hint Code": 5,
    "Hint Code Description": "Leak detected",
    "RSSI Value": -90,
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "NT003",
    Version: "1.0",
    "Device Type": "Elec",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "NT003",
    "Actual Date": "10.03.2024",
    "Actual Energy / HCA": 280000,
    "Actual Unit": "Wh",
    "Hint Code": 12,
    "Hint Code Description": "Peak usage",
    "RSSI Value": -88,
    "Telegram Type": "EMH",
  },
  {
    "Frame Type": "1B",
    Manufacturer: "EMH",
    ID: "NT004",
    Version: "1.0",
    "Device Type": "Water",
    "TPL-Config": "300",
    "Access Number": 1,
    Status: "valid",
    Encryption: 0,
    "Number Meter": "NT004",
    "Actual Date": "05.04.2024",
    "Actual Volume": 180,
    "Actual Unit Volume": "m³",
    "Hint Code": 5,
    "Hint Code Description": "Unusual pattern",
    "RSSI Value": -82,
    "Telegram Type": "EFE_WaterStar M",
  },
];

const einsparungDemoData: MeterReadingType[] = [
  ...coldWaterDemoData,
  ...hotWaterDemoData,
  ...electricityDemoData,
  ...heatingDemoData,
];

export default function TourDashboardCharts() {
  return (
    <ContentWrapper className="grid gap-3 [grid-template-columns:minmax(0,1fr)_minmax(0,1fr)_400px] max-[1100px]:[grid-template-columns:repeat(2,minmax(0,1fr))] max-medium:[grid-template-columns:minmax(0,1fr)]">
      <div className="flex flex-col gap-3">
        <div id="WaterChart" className="h-[312px]">
          <WaterChart
            csvText={coldWaterDemoData}
            color="#6083CC"
            title="Kaltwasser"
            chartType="cold"
            isEmpty={false}
          />
        </div>
        <div className="h-[271px]">
          <WaterChart
            csvText={hotWaterDemoData}
            color="#E74B3C"
            title="Warmwasser"
            chartType="hot"
            isEmpty={false}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="electricity-chart-container h-[265px]">
          <ElectricityChart
            electricityReadings={electricityDemoData}
            isEmpty={false}
          />
        </div>
        <div className="heating-chart-container h-[318px]">
          <HeatingCosts
            csvText={heatingDemoData}
            isEmpty={false}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 max-[1100px]:col-span-2 max-[1100px]:grid max-[1100px]:grid-cols-2 max-[1100px]:gap-3 max-medium:col-span-1 max-medium:grid-cols-1 max-medium:flex max-medium:flex-col">
        <div className="notifications-chart-container h-[360px] max-[1100px]:h-[300px]">
          <NotificationsChart
            isEmpty={false}
            parsedData={{ data: notificationsDemoData, errors: [] }}
          />
        </div>
        <div className="einsparung-chart-container h-[220px] max-[1100px]:h-[300px]">
          <EinsparungChart
            selectedData={einsparungDemoData}
            isEmpty={false}
          />
        </div>
      </div>
    </ContentWrapper>
  );
}
