"use client";

import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import {
  receipt_building,
  receipt_calendar,
  receipt_line,
} from "@/static/icons";
import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";
import type { ContractType } from "@/types";
import { formatEuro } from "@/utils";
import { differenceInMonths } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type ReceiptProps = {
  title: string;
  objektId?: string;
  relatedContracts?: ContractType[];
};

export default function BetriebskostenabrechnungReceipt({
  title,
  objektId,
  relatedContracts,
}: ReceiptProps) {
  const { getFormattedDates, documentGroups } = useBetriebskostenabrechnungStore();
  const router = useRouter();

  const { start_date, end_date } = getFormattedDates();

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

  useEffect(() => {
    if (!getFormattedDates().start_date || !getFormattedDates().end_date) {
      router.push(
        `${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objektId}/abrechnungszeitraum`
      );
    }
  }, []);

  const filteredContracts = relatedContracts?.filter((contract) => {
    if (!contract.rental_start_date || !contract.rental_end_date) return false;

    const rentalStart = new Date(contract.rental_start_date);
    const rentalEnd = new Date(contract.rental_end_date);
    const periodStart = new Date(start_date);
    const periodEnd = new Date(end_date);

    return rentalEnd >= periodStart && rentalStart <= periodEnd;
  });

  const monthsDiff =
    start_date && end_date
      ? differenceInMonths(new Date(end_date), new Date(start_date))
      : 0;

  const totalContractsAmount =
    (filteredContracts ?? []).reduce(
      (acc, contract) => acc + Number(contract.cold_rent ?? 0),
      0
    ) * monthsDiff;


  const totalDiff = totalContractsAmount - totalAmount;

  return (
    <div className="bg-[#EFEEEC] h-fit min-w-sm max-xl:min-w-xs w-fit rounded-2xl px-4 py-5 flex items-start justify-center">
      <div className="bg-white py-4 px-[18px] rounded w-full shadow-sm space-y-8 max-xl:space-y-4">
        <p className="flex items-center justify-start gap-2 font-medium text-admin_dark_text max-xl:text-sm">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-7 max-h-7 max-xl:max-w-4 max-xl:max-h-4"
            src={receipt_building}
            alt="receipt_building"
          />
          {title}
        </p>
        <p className="flex items-centerjustify-start gap-2 text-admin_dark_text max-xl:text-sm">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-7 max-h-7 max-xl:max-w-4 max-xl:max-h-4"
            src={receipt_calendar}
            alt="receipt_calendar"
          />
          {start_date} - {end_date}
        </p>
        <div className="flex flex-col items-center justify-center">
          <p className="text-admin_dark_text">Differenzbetrag</p>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-[260px] max-h-3"
            src={receipt_line}
            alt="receipt_line"
          />
          <span className="text-3xl text-admin_dark_text">{formatEuro(totalDiff)}</span>
        </div>
        <div className="max-xl:text-sm">
          <div className="pb-4 border-b border-[#e0e0e0] space-y-4">
            <div className="flex items-center justify-between text-admin_dark_text">
              Kosten für das gesamte Gebäude
              <span>{formatEuro(totalSpreadedAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-admin_dark_text">
              Direkte Kosten
              <span className="text-[#676767] font-normal">{formatEuro(totalDirectCosts)}</span>
            </div>
          </div>
          <div className="py-4 border-b border-[#e0e0e0] space-y-4">
            <div className="flex items-center justify-between text-admin_dark_text">
              Gesamtkosten
              <span className="text-[#676767] font-normal">{formatEuro(totalAmount)}</span>
            </div>
          </div>
          <div className="py-4 border-b border-[#e0e0e0] space-y-4">
            <div className="flex items-center justify-between text-admin_dark_text">
              Hausgeld
              <span>0 €</span>
            </div>
            <div className="flex items-center justify-between text-admin_dark_text">
              Nebenkostenvorauszahlung
              <span>
                {totalContractsAmount
                  ? formatEuro(totalContractsAmount)
                  : "0,00 €"}
              </span>
            </div>
          </div>
          <div className="border-t border-admin_dark_text pt-4 flex items-center justify-between font-bold text-admin_dark_text">
            Differenz
            <span className="text-[#676767] font-normal">{formatEuro(totalDiff)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
