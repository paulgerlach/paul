"use client";

import { Button } from "@/components/Basic/ui/Button";
import { useChartStore } from "@/store/useChartStore";
import { endOfMonth, startOfMonth } from "date-fns";
import Image from "next/image";
import { filter_reset } from "@/static/icons";
import { useParams } from "next/navigation";
import { useObjektsWithLocals } from "@/apiClient";
import { useUsersObjektsWithLocals } from "@/apiClient";

export default function ResetFiltersBar() {
  const { user_id } = useParams();
  const { data: apartments } = useObjektsWithLocals();
  const { data: usersApartments } = useUsersObjektsWithLocals(String(user_id));
  const { setDates, setMeterIds } = useChartStore();

  const handleReset = () => {
    // Reset date to current month
    setDates(startOfMonth(new Date()), endOfMonth(new Date()));

    // Select all meter ids like AdminApartmentsDropdown.selectAll
    const isAdmin = !!user_id;
    const source = (isAdmin ? usersApartments : apartments) || [];
    const allMeterIds = (source as any)?.flatMap(
      (appartment: any) =>
        (appartment.locals
          ?.flatMap((local: any) => local.meter_ids)
          ?.filter(Boolean) as string[]) || []
    );
    setMeterIds(allMeterIds || []);

    // Notify the dropdown to update its internal selection state
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("admin-select-all-apartments"));
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div />
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="h-8 px-3 gap-2"
      >
        <Image
          width={0}
          height={0}
          sizes="100vw"
          className="w-4 h-4"
          alt="reset filters"
          src={filter_reset}
        />
        <span className="text-sm">Filter zurücksetzen</span>
      </Button>
    </div>
  );
}


