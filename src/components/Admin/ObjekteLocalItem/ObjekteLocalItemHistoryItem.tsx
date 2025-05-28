import { pencil, small_calendar, trashcan } from "@/static/icons";
import type { TenantType } from "@/types";
import Image from "next/image";
import { differenceInMonths } from "date-fns";
import Link from "next/link";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { useDeleteDialogStore } from "@/store/useDeleteDIalogStore";

export default function ObjekteLocalItemHistoryItem({
  historyItem,
  objektID,
  localID,
}: {
  historyItem?: TenantType;
  objektID: string;
  localID: string;
}) {
  const { openDialog, setItemID } = useDeleteDialogStore();
  const duration =
    differenceInMonths(
      historyItem?.rental_end_date || "",
      historyItem?.rental_start_date || ""
    ) + 1;

  const pricePerMonth = Number(historyItem?.cold_rent) || 0;
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
      style={{ borderColor: historyItem?.is_current ? "#8AD68F" : "#1E322D" }}
      className="border-l gap-4 relative pl-7">
      <span
        style={{
          backgroundColor: historyItem?.is_current ? "#8AD68F" : "#1E322D",
        }}
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
            {historyItem?.rental_start_date} - {historyItem?.rental_end_date}
          </span>
        </div>
        <div className="h-px w-full bg-[#E0E0E0]" />
      </div>
      <div className="px-3 flex items-center justify-between py-8">
        <div className="flex items-center justify-start gap-9">
          <span
            style={{
              backgroundColor: historyItem?.is_current
                ? "#E7F2E8"
                : "#1E322D1A",
            }}
            className="flex items-center justify-center rounded-full font-medium size-14">
            {historyItem?.first_name["0"]}
            {historyItem?.last_name["0"]}
          </span>
          <div>
            <p className="text-[#333333] text-lg">
              {historyItem?.first_name} {historyItem?.last_name}
            </p>
            <p className="text-[#757575]">
              {formattedAmount} {formattedRate} x {duration}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <p className="text-sm text-[#757575]">0/365 Tage</p>
          <Link
            className="cursor-pointer"
            href={`${ROUTE_OBJEKTE}/${objektID}/${localID}/${historyItem?.id}/edit`}>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6"
              src={pencil}
              alt="pencil"
            />
          </Link>
          <button
            className="cursor-pointer"
            onClick={() => {
              openDialog("tenant_delete");
              setItemID(historyItem?.id ?? null);
            }}>
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
