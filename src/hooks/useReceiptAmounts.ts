import { useMemo } from "react";
import { useDiffInMonths } from "@/hooks/useDiffInMonths";
import { BetriebskostenabrechnungCostType } from "@/store/useBetriebskostenabrechnungStore";
import { HeizkostenabrechnungCostType } from "@/store/useHeizkostenabrechnungStore";
import type { ContractType } from "@/types";

export function useReceiptAmounts({
  documentGroups,
  contracts,
  start_date,
  end_date,
}: {
  documentGroups:
    | BetriebskostenabrechnungCostType[]
    | HeizkostenabrechnungCostType[];
  contracts?: ContractType[];
  start_date: string;
  end_date: string;
}) {
  const monthsDiff = useDiffInMonths(start_date, end_date);

  const {
    totalSpreadedAmount,
    totalDirectCosts,
    totalAmount,
    totalContractsAmount,
    totalDiff,
  } = useMemo(() => {
    const totalSpreadedAmount = documentGroups.reduce((acc, group) => {
      const groupTotal =
        group.data?.reduce((sum, item) => {
          if (item.for_all_tenants) {
            return sum + Number(item.total_amount || 0);
          }
          return sum;
        }, 0) || 0;
      return acc + groupTotal;
    }, 0);

    const totalDirectCosts = documentGroups.reduce((acc, group) => {
      const groupTotal =
        group.data?.reduce((sum, item) => {
          if (!item.for_all_tenants) {
            return sum + Number(item.total_amount || 0);
          }
          return sum;
        }, 0) || 0;
      return acc + groupTotal;
    }, 0);

    const totalAmount = totalSpreadedAmount + totalDirectCosts;

    const filteredContracts = contracts?.filter((contract) => {
      if (!contract.rental_start_date || !contract.rental_end_date)
        return false;

      const rentalStart = new Date(contract.rental_start_date);
      const rentalEnd = new Date(contract.rental_end_date);
      const periodStart = new Date(start_date);
      const periodEnd = new Date(end_date);

      return rentalEnd >= periodStart && rentalStart <= periodEnd;
    });

    const totalContractsAmount =
      (filteredContracts ?? []).reduce(
        (acc, contract) => acc + Number(contract.cold_rent ?? 0),
        0
      ) * monthsDiff;

    const totalDiff = totalContractsAmount - totalAmount;

    return {
      totalSpreadedAmount,
      totalDirectCosts,
      totalAmount,
      totalContractsAmount,
      totalDiff,
    };
  }, [documentGroups, contracts, start_date, end_date, monthsDiff]);

  return {
    totalSpreadedAmount,
    totalDirectCosts,
    totalAmount,
    totalContractsAmount,
    totalDiff,
    monthsDiff,
  };
}
