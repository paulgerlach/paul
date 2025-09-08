"use client";

import { useEffect, useState } from "react";
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
import ErrorDetailsModal from "./ErrorDetailsModal";
import { MeterReadingType } from "@/api";
import {
  getDevicesWithErrors,
  groupErrorsBySeverity,
  groupErrorsByDeviceType,
} from "@/utils/errorFlagInterpreter";
import { StaticImageData } from "next/image";
import { useChartStore } from "@/store/useChartStore";

interface NotificationItem {
  leftIcon: StaticImageData;
  rightIcon: StaticImageData;
  leftBg: string;
  rightBg: string;
  title: string;
  subtitle: string;
}

interface NotificationsChartProps {
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  parsedData?: {
    data: MeterReadingType[];
    errors?: { row: number; error: string; rawRow: any }[];
  };
}

const dummy_notifications = [
  {
    Date: "22.03.2025",
    Building: "Friedrichstr. 15",
    ID: 53157205,
    Severity: "critical",
    "Notification Type": "Sensor",
    "Notification Message": "Sensor defekt bei Zähler 53157205.",
    "Hint Code": "Bit 10",
    "Hint Code Description": "Sensor defekt",
  },
  {
    Date: "08.04.2025",
    Building: "Alte Jakobstr. 1",
    ID: 13551768,
    Severity: "critical",
    "Notification Type": "Manipulation",
    "Notification Message": "Manipulation erkannt bei Zähler 13551768.",
    "Hint Code": "Bit 7",
    "Hint Code Description": "Manipulation erkannt",
  },
  {
    Date: "08.04.2025",
    Building: "Friedrichstr. 15",
    ID: 53157163,
    Severity: "critical",
    "Notification Type": "Leckage",
    "Notification Message": "Leckage erkannt bei Zähler 53157163.",
    "Hint Code": "Bit 5",
    "Hint Code Description": "Leckage erkannt",
  },
  {
    Date: "21.04.2025",
    Building: "Friedrichstr. 15",
    ID: 53157292,
    Severity: "critical",
    "Notification Type": "Manipulation",
    "Notification Message": "Manipulation erkannt bei Zähler 53157292.",
    "Hint Code": "Bit 7",
    "Hint Code Description": "Manipulation erkannt",
  },
  {
    Date: "13.05.2025",
    Building: "Friedrichstr. 15",
    ID: 53157190,
    Severity: "critical",
    "Notification Type": "Leckage",
    "Notification Message": "Leckage erkannt bei Zähler 53157190.",
    "Hint Code": "Bit 5",
    "Hint Code Description": "Leckage erkannt",
  },
  {
    Date: "22.05.2025",
    Building: "Unter den Linden 42",
    ID: 53157236,
    Severity: "critical",
    "Notification Type": "Blockade",
    "Notification Message": "Blockade bei Zähler 53157236.",
    "Hint Code": "Bit 6",
    "Hint Code Description": "Blockade",
  },
  {
    Date: "22.05.2025",
    Building: "Friedrichstr. 15",
    ID: 53157283,
    Severity: "critical",
    "Notification Type": "Funkverbindung",
    "Notification Message": "Funkverbindung gestört bei Zähler 53157283.",
    "Hint Code": "Bit 9",
    "Hint Code Description": "Funkverbindung gestört",
  },
  {
    Date: "26.05.2025",
    Building: "Friedrichstr. 15",
    ID: 53157256,
    Severity: "critical",
    "Notification Type": "Batteriestand",
    "Notification Message": "Batteriestand niedrig bei Zähler 53157256.",
    "Hint Code": "Bit 8",
    "Hint Code Description": "Batteriestand niedrig",
  },
  {
    Date: "17.06.2025",
    Building: "Friedrichstr. 15",
    ID: 53157262,
    Severity: "critical",
    "Notification Type": "Funkverbindung",
    "Notification Message": "Funkverbindung gestört bei Zähler 53157262.",
    "Hint Code": "Bit 9",
    "Hint Code Description": "Funkverbindung gestört",
  },
  {
    Date: "27.06.2025",
    Building: "Unter den Linden 42",
    ID: 53157221,
    Severity: "critical",
    "Notification Type": "Sensor",
    "Notification Message": "Sensor defekt bei Zähler 53157221.",
    "Hint Code": "Bit 10",
    "Hint Code Description": "Sensor defekt",
  },
  {
    Date: "02.07.2025",
    Building: "Alte Jakobstr. 1",
    ID: 53157261,
    Severity: "critical",
    "Notification Type": "Sensor",
    "Notification Message": "Sensor defekt bei Zähler 53157261.",
    "Hint Code": "Bit 10",
    "Hint Code Description": "Sensor defekt",
  },
  {
    Date: "15.07.2025",
    Building: "Unter den Linden 42",
    ID: 53157203,
    Severity: "critical",
    "Notification Type": "Batteriestand",
    "Notification Message": "Batteriestand niedrig bei Zähler 53157203.",
    "Hint Code": "Bit 8",
    "Hint Code Description": "Batteriestand niedrig",
  },
  {
    Date: "18.07.2025",
    Building: "Alte Jakobstr. 1",
    ID: 53157297,
    Severity: "critical",
    "Notification Type": "Manipulation",
    "Notification Message": "Manipulation erkannt bei Zähler 53157297.",
    "Hint Code": "Bit 7",
    "Hint Code Description": "Manipulation erkannt",
  },
  {
    Date: "04.08.2025",
    Building: "Alte Jakobstr. 1",
    ID: 53157243,
    Severity: "critical",
    "Notification Type": "Sensor",
    "Notification Message": "Sensor defekt bei Zähler 53157243.",
    "Hint Code": "Bit 10",
    "Hint Code Description": "Sensor defekt",
  },
  {
    Date: "21.08.2025",
    Building: "Unter den Linden 42",
    ID: 53157164,
    Severity: "critical",
    "Notification Type": "Blockade",
    "Notification Message": "Blockade bei Zähler 53157164.",
    "Hint Code": "Bit 6",
    "Hint Code Description": "Blockade",
  },
  {
    Date: "28.08.2025",
    Building: "Friedrichstr. 15",
    ID: 53157265,
    Severity: "critical",
    "Notification Type": "Leckage",
    "Notification Message": "Leckage erkannt bei Zähler 53157265.",
    "Hint Code": "Bit 5",
    "Hint Code Description": "Leckage erkannt",
  },
];

export default function NotificationsChart({
  isEmpty,
  emptyTitle,
  emptyDescription,
  parsedData,
}: NotificationsChartProps) {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const { meterIds } = useChartStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const deleteNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const generateNotifications = (): NotificationItem[] => {
    const notifications: NotificationItem[] = [];

    if (isEmpty) {
      return notifications;
    }

    if (!parsedData?.data || parsedData.data.length === 0) {
      return notifications;
    }

    const deviceErrors = getDevicesWithErrors(parsedData);

    if (deviceErrors.length === 0) {
      const totalDevices = parsedData.data.length;
      const heatDevices = parsedData.data.filter(
        (d) => d["Device Type"] === "Heat"
      ).length;
      const waterDevices = parsedData.data.filter(
        (d) => d["Device Type"] === "Water" || d["Device Type"] === "WWater"
      ).length;

      notifications.push({
        leftIcon: keys,
        rightIcon: green_check,
        leftBg: "#E7E8EA",
        rightBg: "#E7F2E8",
        title: "Alle Zähler funktionieren korrekt",
        subtitle: `${totalDevices} Geräte ohne Fehler (${heatDevices} Wärme, ${waterDevices} Wasser)`,
      });

      return notifications;
    }

    const errorsBySeverity = groupErrorsBySeverity(deviceErrors);

    if (errorsBySeverity.critical.length > 0) {
      notifications.push({
        leftIcon: alert_triangle,
        rightIcon: alert_triangle,
        leftBg: "#E7E8EA",
        rightBg: "#FFE5E5",
        title: "criticale Zählerfehler",
        subtitle: `${errorsBySeverity.critical.length} Geräte mit schwerwiegenden Problemen`,
      });
    }

    if (errorsBySeverity.high.length > 0) {
      notifications.push({
        leftIcon: alert_triangle,
        rightIcon: alert_triangle,
        leftBg: "#E7E8EA",
        rightBg: "#F7E7D5",
        title: "Wichtige Zählerfehler",
        subtitle: `${errorsBySeverity.high.length} Geräte mit Sensor- oder Kommunikationsfehlern`,
      });
    }

    if (errorsBySeverity.medium.length > 0) {
      notifications.push({
        leftIcon: keys,
        rightIcon: blue_info,
        leftBg: "#E7E8EA",
        rightBg: "#E5EBF5",
        title: "Wartungshinweise",
        subtitle: `${errorsBySeverity.medium.length} Geräte benötigen Wartung`,
      });
    }

    if (errorsBySeverity.low.length > 0) {
      notifications.push({
        leftIcon: keys,
        rightIcon: blue_info,
        leftBg: "#E7E8EA",
        rightBg: "#E5EBF5",
        title: "Geringfügige Probleme",
        subtitle: `${errorsBySeverity.low.length} Geräte mit kleinen Problemen`,
      });
    }

    const errorsByDeviceType = groupErrorsByDeviceType(deviceErrors);

    if (notifications.length < 3) {
      if (errorsByDeviceType.Heat && errorsByDeviceType.Heat.length > 0) {
        notifications.push({
          leftIcon: heater,
          rightIcon: alert_triangle,
          leftBg: "#E7E8EA",
          rightBg: "#F7E7D5",
          title: "Wärmezähler Probleme",
          subtitle: `${errorsByDeviceType.Heat.length} Wärmezähler melden Fehler`,
        });
      }

      if (errorsByDeviceType.Water && errorsByDeviceType.Water.length > 0) {
        notifications.push({
          leftIcon: pipe_water,
          rightIcon: alert_triangle,
          leftBg: "#E7E8EA",
          rightBg: "#F7E7D5",
          title: "Wasserzähler Probleme",
          subtitle: `${errorsByDeviceType.Water.length} Wasserzähler melden Fehler`,
        });
      }

      if (errorsByDeviceType.WWater && errorsByDeviceType.WWater.length > 0) {
        notifications.push({
          leftIcon: hot_water,
          rightIcon: alert_triangle,
          leftBg: "#E7E8EA",
          rightBg: "#F7E7D5",
          title: "Warmwasserzähler Probleme",
          subtitle: `${errorsByDeviceType.WWater.length} Warmwasserzähler melden Fehler`,
        });
      }
    }

    for (const notification of dummy_notifications) {
      if (meterIds.includes(notification.ID.toString())) {
        notifications.push({
          leftIcon: alert_triangle,
          rightIcon: alert_triangle,
          leftBg: "#E7E8EA",
          rightBg: "#FFE5E5",
          title: `${notification["Notification Type"]} - Zähler ${notification.ID}`,
          subtitle: notification["Notification Message"],
        });
      }
    }

    return notifications.slice(0, 4);
  };

  useEffect(() => {
    const generated = generateNotifications();
    setNotifications(generated);
  }, [isEmpty, parsedData, meterIds]);

  // useEffect(() => {
  //   console.log("meterIds", meterIds);
  //   for (const notification of dummy_notifications) {
  //     if (meterIds.includes(notification.ID.toString())) {
  //       console.log("Adding dummy notification for meter ID", notification.ID);
  //       // notifications.push({
  //       //   leftIcon: alert_triangle,
  //       //   rightIcon: alert_triangle,
  //       //   leftBg: "#E7E8EA",
  //       //   rightBg: "#FFE5E5",
  //       //   title: `${notification["Notification Type"]} - Zähler ${notification.ID}`,
  //       //   subtitle: notification["Notification Message"],
  //       // });
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [meterIds]);

  const hasDeviceErrors =
    !isEmpty && parsedData?.data && getDevicesWithErrors(parsedData).length > 0;

  return (
    <div
      className={`rounded-2xl shadow p-4 bg-white px-5 h-full flex flex-col ${
        isEmpty ? "flex flex-col" : ""
      }`}
    >
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
          notifications.map((n, idx) => (
            <div key={idx} className="flex items-start justify-between gap-2">
              <NotificationItem {...n} />
              <button
                onClick={() => deleteNotification(idx)}
                className="text-xs cursor-pointer text-red-600 hover:underline"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
      {/* <>{notifications.length}</> */}
      {hasDeviceErrors && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsErrorModalOpen(true)}
            className="text-[10px] text-link text-center underline w-full inline-block mt-[1.5vw] hover:text-blue-600"
          >
            Detaillierte Fehleranalyse anzeigen
          </button>
          <Link
            className="text-xs text-link text-center underline w-full inline-block mt-3"
            href={ROUTE_HOME}
          >
            Weitere Benachrichtigungen anzeigen
          </Link>
        </div>
      )}

      <ErrorDetailsModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        parsedData={parsedData}
      />
    </div>
  );
}
