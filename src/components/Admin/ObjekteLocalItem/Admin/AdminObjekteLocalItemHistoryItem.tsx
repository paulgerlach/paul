import { pencil, small_calendar, trashcan } from "@/static/icons";
import type { ContractType } from "@/types";
import Image from "next/image";
import { differenceInMonths, format } from "date-fns";
import Link from "next/link";
import { useDialogStore } from "@/store/useDIalogStore";
import { differenceInCalendarDays } from "date-fns";
import { useAdminContractorsByContractID } from "@/apiClient";
import { useParams } from "next/navigation";
import { useSubRouteLink } from "@/lib/clientNavigation";

export default function AdminObjekteLocalItemHistoryItem({
  historyItem,
  localID,
}: {
  historyItem?: ContractType;
  localID?: string;
}) {
  const { openDialog, setItemID } = useDialogStore();
  const { user_id } = useParams();
  const { data: contractors } = useAdminContractorsByContractID(
    historyItem?.id,
    String(user_id)
  );

  const editLink = useSubRouteLink(`${localID}/${historyItem?.id}/edit`);

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

  const days =
    historyItem?.rental_start_date && historyItem?.rental_end_date
      ? differenceInCalendarDays(
          new Date(historyItem.rental_end_date),
          new Date(historyItem.rental_start_date)
        ) + 1
      : 0;

  return (
    <div
      style={{ borderColor: historyItem?.is_current ? "#8AD68F" : "#1E322D" }}
      className="border-l gap-4 relative pl-8"
    >
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
            {historyItem?.rental_start_date
              ? format(new Date(historyItem.rental_start_date), "dd.MM.yyyy")
              : "-"}{" "}
            -{" "}
            {historyItem?.rental_end_date
              ? format(new Date(historyItem.rental_end_date), "dd.MM.yyyy")
              : "-"}
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
            className="flex items-center justify-center rounded-full font-medium size-14 max-xl:text-sm max-xl:size-10"
          >
            {contractors?.[0].first_name["0"]}
            {contractors?.[0].last_name["0"]}
          </span>
          <div>
            <p className="text-admin_dark_text text-lg max-xl:text-sm">
              {contractors
                ?.map((c) => `${c.first_name} ${c.last_name}`)
                .join(", ")}
            </p>
            <p className="text-[#757575] max-xl:text-xs">
              {formattedAmount} {formattedRate} x {duration}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <p className="text-sm text-[#757575]">{days}/365 Tage</p>
          <Link className="cursor-pointer" href={editLink}>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6 max-xl:max-w-4 max-xl:max-h-4"
              src={pencil}
              alt="pencil"
            />
          </Link>
          <button
            className="cursor-pointer"
            onClick={() => {
              openDialog("admin_contract_delete");
              setItemID(historyItem?.id ?? undefined);
            }}
          >
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6 max-xl:max-w-4 max-xl:max-h-4"
              src={trashcan}
              alt="trashcan"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
