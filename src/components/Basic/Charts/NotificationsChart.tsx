"use client";

import { useState } from "react";
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
import { getDevicesWithErrors, groupErrorsBySeverity, groupErrorsByDeviceType } from "@/utils/errorFlagInterpreter";
import { StaticImageData } from "next/image";

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

export default function NotificationsChart({ isEmpty, emptyTitle, emptyDescription, parsedData }: NotificationsChartProps) {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // Generate notifications from device error flags
  const generateNotifications = (): NotificationItem[] => {
    const notifications: NotificationItem[] = [];
    
    if (!parsedData?.data || parsedData.data.length === 0) {
      return notifications;
    }

    // Get devices with error flags
    const deviceErrors = getDevicesWithErrors(parsedData);
    
    if (deviceErrors.length === 0) {
      // No device errors - show success notification
      const totalDevices = parsedData.data.length;
      const heatDevices = parsedData.data.filter(d => d["Device Type"] === "Heat").length;
      const waterDevices = parsedData.data.filter(d => d["Device Type"] === "Water" || d["Device Type"] === "WWater").length;

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

    // Group errors by severity
    const errorsBySeverity = groupErrorsBySeverity(deviceErrors);
    
    // Add critical error notifications first
    if (errorsBySeverity.critical.length > 0) {
      notifications.push({
        leftIcon: alert_triangle,
        rightIcon: alert_triangle,
        leftBg: "#E7E8EA",
        rightBg: "#FFE5E5",
        title: "Kritische Zählerfehler",
        subtitle: `${errorsBySeverity.critical.length} Geräte mit schwerwiegenden Problemen`,
      });
    }

    // Add high severity error notifications
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

    // Add medium severity error notifications
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

    // Add low severity error notifications
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

    // Group by device type for specific notifications
    const errorsByDeviceType = groupErrorsByDeviceType(deviceErrors);
    
    // Add device-specific notifications if we have space
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
          leftIcon: pipe_water,
          rightIcon: alert_triangle,
          leftBg: "#E7E8EA",
          rightBg: "#F7E7D5",
          title: "Warmwasserzähler Probleme",
          subtitle: `${errorsByDeviceType.WWater.length} Warmwasserzähler melden Fehler`,
        });
      }
    }

    return notifications.slice(0, 4); // Limit to 4 notifications
  };

  const notifications = generateNotifications();

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
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setIsErrorModalOpen(true)}
          className="text-[10px] text-link text-center underline w-full inline-block mt-[1.5vw] hover:text-blue-600"
        >
          Detaillierte Fehleranalyse anzeigen
        </button>
        <Link
          className="text-xs text-link text-center underline w-full inline-block mt-3"
          href={ROUTE_HOME}>
          Weitere Benachrichtigungen anzeigen
        </Link>
      </div>

      <ErrorDetailsModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        parsedData={parsedData}
      />
    </div>
  );
}
