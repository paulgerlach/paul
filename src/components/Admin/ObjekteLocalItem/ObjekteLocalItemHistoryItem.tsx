import { pencil, small_calendar, trashcan } from "@/static/icons";
import type { LocalHistoryType } from "@/types";
import Image from "next/image";
import { differenceInMonths, parse } from "date-fns";

export default function ObjekteLocalItemHistoryItem({
  historyItem,
}: {
  historyItem: LocalHistoryType;
}) {
  const startDate = parse(historyItem.start_date, "dd.MM.yyyy", new Date());
  const endDate = parse(historyItem.end_date, "dd.MM.yyyy", new Date());

  const duration = differenceInMonths(endDate, startDate) + 1;

  const pricePerMonth = historyItem.price_per_month || 0;
  const totalAmount = duration * pricePerMonth;

  const formattedAmount = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(totalAmount);

  const formattedRate = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(pricePerMonth);

  return (
    <div
      style={{ borderColor: historyItem.active ? "#8AD68F" : "#1E322D" }}
      className="border-l gap-4 relative pl-7">
      <span
        style={{ backgroundColor: historyItem.active ? "#8AD68F" : "#1E322D" }}
        className="absolute top-0 left-0 -translate-x-1/2 size-3.5 max-w-3.5 max-h-3.5 rounded-full z-10"
      />
      <div className="grid grid-cols-[auto_1fr] gap-3 items-center justify-start">
        <div className="flex items-center justify-start gap-2.5">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-3.5 max-h-3.5"
            src={small_calendar}
            alt="small_calendar"
          />
          <span className="text-[#757575] text-sm">
            {historyItem.start_date} - {historyItem.end_date}
          </span>
        </div>
        <div className="h-px w-full bg-[#E0E0E0]" />
      </div>
      <div className="px-3 flex items-center justify-between py-8">
        <div className="flex items-center justify-start gap-9">
          <span
            style={{
              backgroundColor: historyItem.active ? "#E7F2E8" : "#1E322D1A",
            }}
            className="flex items-center justify-center rounded-full font-medium size-14">
            {historyItem.first_name["0"]}
            {historyItem.last_name["0"]}
          </span>
          <div>
            <p className="text-[#333333] text-lg">
              {historyItem.first_name} {historyItem.last_name}
            </p>
            <p className="text-[#757575]">
              {formattedAmount} {formattedRate} x {duration}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <p className="text-sm text-[#757575]">{historyItem.days}/365 Tage</p>
          <button>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6"
              src={pencil}
              alt="pencil"
            />
          </button>
          <button>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6"
              src={trashcan}
              alt="trashcan"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
