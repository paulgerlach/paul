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
import NotificationItem from "./NotificationItem";
import { EmptyState } from "@/components/Basic/ui/States";

const notifications = [
  {
    leftIcon: keys,
    rightIcon: green_check,
    leftBg: "#E7E8EA",
    rightBg: "#E7F2E8",
    title: "Mieter eingezogen",
    subtitle: "WE PL12VH3OGr",
  },
  {
    leftIcon: hot_water,
    rightIcon: blue_info,
    leftBg: "#E7E8EA",
    rightBg: "#E5EBF5",
    title: "Mieter eingezogen",
    subtitle: "WE PL12VH3OGr",
  },
  {
    leftIcon: heater,
    rightIcon: blue_info,
    leftBg: "#E7E8EA",
    rightBg: "#E5EBF5",
    title: "Mieter eingezogen",
    subtitle: "WE PL12VH3OGr",
  },
  {
    leftIcon: pipe_water,
    rightIcon: alert_triangle,
    leftBg: "#E7E8EA",
    rightBg: "#F7E7D5",
    title: "Mieter eingezogen",
    subtitle: "WE PL12VH3OGr",
  },
];

export default function NotificationsChart({ isEmpty, emptyTitle, emptyDescription }: { isEmpty?: boolean; emptyTitle?: string; emptyDescription?: string }) {
  return (
    <div className={`rounded-2xl shadow p-4 bg-white px-5 h-full flex flex-col ${isEmpty ? "flex flex-col" : ""}`}>
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <h2 className="text-lg font-medium max-small:text-sm max-medium:text-sm text-gray-800">
          Benachrichtigungen
        </h2>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-6 max-h-6 max-small:max-w-4 max-small:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
          src={notification}
          alt="notification"
        />
      </div>
      <div className="space-y-2 flex-1 overflow-auto pr-1">
        {isEmpty ? (
          <EmptyState
            title={emptyTitle ?? "No data available."}
            description={emptyDescription ?? "No data available."}
            imageSrc={notification.src}
            imageAlt="Benachrichtigungen"
          />
        ) : (
          notifications.map((n, idx) => <NotificationItem key={idx} {...n} />)
        )}
      </div>
      <div>
        <Link
          className="text-xs text-link text-center underline w-full inline-block mt-3"
          href={ROUTE_HOME}>
          Weitere Benachrichtigungen anzeigen
        </Link>
      </div>
    </div>
  );
}
