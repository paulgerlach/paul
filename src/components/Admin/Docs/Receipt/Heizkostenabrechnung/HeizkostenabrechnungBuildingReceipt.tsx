"use client";

import { useReceiptAmounts } from "@/hooks/useReceiptAmounts";
import {
  receipt_building,
  receipt_calendar,
  receipt_line,
} from "@/static/icons";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { ContractType, LocalType } from "@/types";
import { formatEuro } from "@/utils";
import Image from "next/image";

export type ReceiptProps = {
  title: string;
  locals: (LocalType & {
    contracts: ContractType[];
  })[];
};

export default function HeizkostenabrechnungBuildingReceipt({
  title,
  locals,
}: ReceiptProps) {
  const { getFormattedDates, documentGroups } = useHeizkostenabrechnungStore();

  const { start_date, end_date } = getFormattedDates();

  const {
    totalAmount,
    totalContractsAmount,
    totalDiff,
    totalDirectCosts,
    totalSpreadedAmount,
    totalHouseFee,
  } = useReceiptAmounts({
    documentGroups,
    start_date,
    end_date,
    locals,
  });

  return (
    <div className="bg-[#EFEEEC] h-fit min-w-sm max-xl:min-w-xs max-medium:min-w-0 max-medium:w-full w-fit rounded-2xl max-medium:rounded-xl px-4 max-medium:px-3 py-5 max-medium:py-3 flex items-start justify-center">
      <div className="bg-white py-4 max-medium:py-3 px-[18px] max-medium:px-3 rounded w-full shadow-sm space-y-8 max-xl:space-y-4 max-medium:space-y-3">
        <p className="flex items-center justify-start gap-2 font-medium text-admin_dark_text max-xl:text-sm max-medium:text-xs">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-7 max-h-7 max-xl:max-w-4 max-xl:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
            src={receipt_building}
            alt="receipt_building"
          />
          {title}
        </p>
        <p className="flex items-center justify-start gap-2 text-admin_dark_text max-xl:text-sm max-medium:text-xs">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-7 max-h-7 max-xl:max-w-4 max-xl:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
            src={receipt_calendar}
            alt="receipt_calendar"
          />
          {start_date} - {end_date}
        </p>
        <div className="flex flex-col items-center justify-center">
          <p className="text-admin_dark_text max-medium:text-sm">Differenzbetrag</p>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-[260px] max-medium:max-w-[200px] max-h-3"
            src={receipt_line}
            alt="receipt_line"
          />
          <span className="text-3xl max-medium:text-2xl text-admin_dark_text">
            {formatEuro(totalDiff)}
          </span>
        </div>
        <div className="max-xl:text-sm max-medium:text-xs">
          <div className="pb-4 border-b border-[#e0e0e0] space-y-4 max-xl:space-y-2">
            <div className="flex items-center justify-between text-admin_dark_text">
              Kosten für das gesamte Gebäude
              <span>{formatEuro(totalSpreadedAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-admin_dark_text">
              Direkte Kosten
              <span>{formatEuro(totalDirectCosts)}</span>
            </div>
          </div>
          <div className="py-4 border-b border-[#e0e0e0] space-y-4">
            <div className="flex items-center justify-between text-admin_dark_text">
              Gesamtkosten
              <span>{formatEuro(totalAmount)}</span>
            </div>
          </div>
          <div className="py-4 border-b border-[#e0e0e0] space-y-4">
            <div className="flex items-center justify-between text-admin_dark_text">
              Hausgeld
              <span>{formatEuro(totalHouseFee)}</span>
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
            <span className="text-[#676767] font-normal">
              {formatEuro(totalDiff)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
