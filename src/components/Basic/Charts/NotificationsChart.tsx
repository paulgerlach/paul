import { ROUTE_HOME } from "@/routes/routes";
import {
  alert_triangle,
  blue_info,
  green_check,
  heater,
  hot_water,
  keys,
  notification,
  pipe_water,
} from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default function NotificationsChart() {
  return (
    <div className="rounded-2xl row-span-7 shadow p-4 bg-white px-5">
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-gray-800">
          Benachrichtigungen
        </h2>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-6 max-h-6"
          src={notification}
          alt="notification"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-start gap-1.5">
          <span className="flex items-center justify-center w-16 h-16 rounded-sm bg-[#E7E8EA]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-7 max-h-6"
              src={keys}
              alt="keys"
            />
          </span>
          <span className="flex items-center justify-center w-16 h-16 rounded-sm bg-[#E7F2E8]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6"
              src={green_check}
              alt="green_check"
            />
          </span>
          <div>
            <p className="text-xl text-black/50">Mieter eingezogen</p>
            <p className="text-xs text-black/50">WE PL12VH3OGr</p>
          </div>
        </div>
        <div className="flex items-center justify-start gap-1.5">
          <span className="flex items-center justify-center w-16 h-16 rounded-sm bg-[#E7E8EA]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-7 max-h-6"
              src={hot_water}
              alt="hot_water"
            />
          </span>
          <span className="flex items-center justify-center w-16 h-16 rounded-sm bg-[#E5EBF5]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6"
              src={blue_info}
              alt="blue_info"
            />
          </span>
          <div>
            <p className="text-xl text-black/50">Mieter eingezogen</p>
            <p className="text-xs text-black/50">WE PL12VH3OGr</p>
          </div>
        </div>
        <div className="flex items-center justify-start gap-1.5">
          <span className="flex items-center justify-center w-16 h-16 rounded-sm bg-[#E7E8EA]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-7 max-h-6"
              src={heater}
              alt="heater"
            />
          </span>
          <span className="flex items-center justify-center w-16 h-16 rounded-sm bg-[#E5EBF5]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6"
              src={blue_info}
              alt="blue_info"
            />
          </span>
          <div>
            <p className="text-xl text-black/50">Mieter eingezogen</p>
            <p className="text-xs text-black/50">WE PL12VH3OGr</p>
          </div>
        </div>
        <div className="flex items-center justify-start gap-1.5">
          <span className="flex items-center justify-center w-16 h-16 rounded-sm bg-[#E7E8EA]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-7 max-h-6"
              src={pipe_water}
              alt="pipe_water"
            />
          </span>
          <span className="flex items-center justify-center w-16 h-16 rounded-sm bg-[#F7E7D5]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-6 max-h-6"
              src={alert_triangle}
              alt="alert_triangle"
            />
          </span>
          <div>
            <p className="text-xl text-black/50">Mieter eingezogen</p>
            <p className="text-xs text-black/50">WE PL12VH3OGr</p>
          </div>
        </div>
      </div>
      <div>
        <Link
          className="text-[10px] text-link text-center underline w-full inline-block mt-10"
          href={ROUTE_HOME}>
          Weitere Benachrichtigungen anzeigen
        </Link>
      </div>
    </div>
  );
}
