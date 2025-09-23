import { useMemo } from "react";
import { useDiffInMonths } from "@/hooks/useDiffInMonths";
import { BetriebskostenabrechnungCostType } from "@/store/useBetriebskostenabrechnungStore";
import { HeizkostenabrechnungCostType } from "@/store/useHeizkostenabrechnungStore";
import type { ContractType, LocalType } from "@/types";
import { differenceInMonths, max, min, parse } from "date-fns";

export function useReceiptAmounts({
  documentGroups,
  start_date,
  end_date,
  locals
}: {
  documentGroups:
  | BetriebskostenabrechnungCostType[]
  | HeizkostenabrechnungCostType[];
  start_date: string;
  end_date: string;
  locals: (LocalType & { contracts: ContractType[] })[];
}) {
  const monthsDiff = useDiffInMonths(start_date, end_date);

  const {
    totalSpreadedAmount,
    totalDirectCosts,
    totalAmount,
    totalContractsAmount,
    totalDiff,
    totalHouseFee
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

    const periodStart = parse(start_date, "dd.MM.yyyy", new Date());
    const periodEnd = parse(end_date, "dd.MM.yyyy", new Date());

    const allContracts = locals.flatMap((local) => local.contracts ?? []);

    const filteredContracts = allContracts.filter((contract) => {
      if (!contract.rental_start_date || !contract.rental_end_date) return false;
      const rentalEnd = new Date(contract.rental_end_date);
      return rentalEnd <= periodEnd;
    });

    const totalContractsAmount = filteredContracts.reduce((acc, contract) => {
      const rentalStart = new Date(contract.rental_start_date!);
      const rentalEnd = new Date(contract.rental_end_date!);

      const overlapStart = max([rentalStart, periodStart]);
      const overlapEnd = min([rentalEnd, periodEnd]);

      let overlapMonths = differenceInMonths(overlapEnd, overlapStart) + 1;
      if (overlapMonths < 0) overlapMonths = 0;

      return acc + overlapMonths * Number(contract.additional_costs ?? 0);
    }, 0);

    const totalHouseFee = locals.reduce(
      (acc, local) => acc + Number(local.house_fee ?? 0),
      0
    );

    const totalDiff = totalContractsAmount - totalAmount;

    return {
      totalSpreadedAmount,
      totalDirectCosts,
      totalAmount,
      totalContractsAmount,
      totalDiff,
      totalHouseFee
    };
  }, [documentGroups, locals, start_date, end_date]);

  return {
    totalSpreadedAmount,
    totalDirectCosts,
    totalAmount,
    totalContractsAmount,
    totalDiff,
    monthsDiff,
    totalHouseFee
  };
}
