"use client";

import { useState } from "react";
import CostTypeItem from "./CostTypeItem";
import type { CostType } from "@/types";
import {
  fuelCostTypes,
  chimneySweepCostsTypes,
  maintenanceCostsTypes,
  meteringDeviceRentalTypes,
  meteringServiceCostsTypes,
  operatingCurrentTypes,
  otherOperatingCostsTypes,
} from "@/static/formSelectOptions";

const costTypes: CostType[] = [
  {
    key: "fuel_costs",
    options: fuelCostTypes,
  },
  {
    key: "operating_current",
    options: operatingCurrentTypes,
  },
  {
    key: "maintenance_costs",
    options: maintenanceCostsTypes,
  },
  {
    key: "metering_service_costs",
    options: meteringServiceCostsTypes,
  },
  {
    key: "metering_device_rental",
    options: meteringDeviceRentalTypes,
  },
  {
    key: "chimney_sweep_costs",
    options: chimneySweepCostsTypes,
  },
  {
    key: "other_operating_costs",
    options: otherOperatingCostsTypes,
  },
];

export default function CostTypesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="overflow-y-auto space-y-4">
      {costTypes?.map((type, index) => (
        <CostTypeItem
          isOpen={openIndex === index}
          onClick={handleClick}
          key={type.key}
          type={type}
          index={index}
        />
      ))}
    </div>
  );
}
