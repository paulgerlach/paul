"use client";

import { useEffect, useState } from "react";
import { ROUTE_HOME } from "@/routes/routes";
import {
  alert_triangle,
  blue_info,
  caract_battery,
  dots_button,
  green_check,
  heater,
  hot_water,
  keys,
  notification,
  pipe_water,
  cold_water,
} from "@/static/icons";
import Image from "next/image";
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
import { Pencil, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { useAuthUser } from "@/apiClient";

interface NotificationItem {
  leftIcon: StaticImageData;
  rightIcon: StaticImageData;
  leftBg: string;
  rightBg: string;
  title: string;
  subtitle: string;
  meterId?: number;
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
    Date: "05.09.2025",
    Building: "Friedrichstr. 15",
    ID: 53157195, // Random cold water meter ID
    Severity: "critical",
    "Notification Type": "Leckage",
    "Notification Message":
      "Leckage erkannt - Rohrbruch bei Kaltwasserzähler 53157195.",
    "Hint Code": "Bit 5",
    "Hint Code Description": "Leckage erkannt",
    Category: "coldwater",
  },
  {
    Date: "06.09.2025",
    Building: "Alte Jakobstr. 1",
    ID: 53157166, // Random heat meter ID (used for smoke detector)
    Severity: "high",
    "Notification Type": "Rauchwarnmelder",
    "Notification Message":
      "Rauchwarnmelder wurde abgenommen bei Heizungsbereich 53157166.",
    "Hint Code": "Bit 12",
    "Hint Code Description": "Rauchwarnmelder entfernt",
    Category: "heatMeters",
  },
  {
    Date: "07.09.2025",
    Building: "Unter den Linden 42",
    ID: 53157218, // Random hot water meter ID
    Severity: "medium",
    "Notification Type": "Verbrauchsanstieg",
    "Notification Message":
      "Warmwasserverbrauch ist um 32% angestiegen bei Zähler 53157218.",
    "Hint Code": "Bit 15",
    "Hint Code Description": "Ungewöhnlicher Verbrauchsanstieg",
    Category: "hotwater",
  },
  {
    Date: "08.09.2025",
    Building: "Friedrichstr. 15",
    ID: 63157201, // Random cold water meter ID (different series)
    Severity: "medium",
    "Notification Type": "Verbrauchsanstieg",
    "Notification Message":
      "Kaltwasserverbrauch ist um 42% angestiegen bei Zähler 63157201.",
    "Hint Code": "Bit 15",
    "Hint Code Description": "Ungewöhnlicher Verbrauchsanstieg",
    Category: "coldwater",
  },
];

export default function NotificationsChart({
  isEmpty,
  emptyTitle,
  emptyDescription,
  parsedData,
}: NotificationsChartProps) {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [selectedMeterId, setSelectedMeterId] = useState<number | undefined>(undefined);
  const { meterIds } = useChartStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationQueue, setNotificationQueue] = useState<NotificationItem[]>([]);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const { data: user } = useAuthUser();
  
  // Check if current user is the demo account
  const isDemoAccount = user?.email === "heidi@hausverwaltung.de";

  const openErrorModal = (meterId?: number) => {
    setSelectedMeterId(meterId);
    setIsErrorModalOpen(true);
    setOpenPopoverId(null); // Close the popover
  };

  const deleteNotification = (index: number) => {
    setNotifications((prev) => {
      const newNotifications = prev.filter((_, i) => i !== index);
      
      // If we have fewer than 4 notifications and there are items in the queue, add the next one
      if (newNotifications.length < 4 && notificationQueue.length > 0) {
        const nextNotification = notificationQueue[0];
        const updatedQueue = notificationQueue.slice(1);
        setNotificationQueue(updatedQueue);
        
        return [...newNotifications, nextNotification];
      }
      
      return newNotifications;
    });
    setOpenPopoverId(null); // Close the popover after deletion
  };

  const getLeftIconForNotificationType = (
    notificationType: string,
    deviceType?: string
  ) => {
    const type = notificationType.toLowerCase();

    if (type.includes("sensor")) {
      return keys; // sensor icon
    }
    if (type.includes("manipulation")) {
      return alert_triangle; // manipulation/security icon
    }
    if (type.includes("leckage") || type.includes("leak")) {
      return pipe_water; // water leak icon - perfect for pipe broken
    }
    if (type.includes("blockade") || type.includes("block")) {
      return pipe_water; // blockage icon
    }
    if (
      type.includes("funkverbindung") ||
      type.includes("funk") ||
      type.includes("radio") ||
      type.includes("signal")
    ) {
      return keys; // radio/communication icon
    }
    if (type.includes("batterie") || type.includes("battery")) {
      return caract_battery; // battery icon
    }
    if (type.includes("rauchwarnmelder") || type.includes("smoke")) {
      return alert_triangle; // smoke detector icon - alert triangle is appropriate
    }
    if (type.includes("verbrauchsanstieg") || type.includes("consumption")) {
      // Use water icons based on the type of consumption
      if (type.includes("warmwasser") || type.includes("warm water")) {
        return hot_water; // hot water icon for warm water consumption
      }
      if (type.includes("kaltwasser") || type.includes("cold water")) {
        return cold_water; // cold water icon for cold water consumption
      }
      return blue_info; // fallback for general consumption
    }

    // Default icons based on device type if no specific notification type match
    if (deviceType) {
      const dType = deviceType.toLowerCase();
      if (dType.includes("heat") || dType.includes("wärme")) {
        return heater;
      }
      if (dType.includes("wwater") || dType.includes("warmwasser")) {
        return hot_water;
      }
      if (dType.includes("water") || dType.includes("wasser")) {
        return cold_water;
      }
    }

    // Default fallback
    return notification;
  };

  useEffect(() => {
    // NEW: Generate dynamic notifications based on real CSV data and meter selection
    const generateDynamicNotifications = (): NotificationItem[] => {
      // If no data at all, return empty (will show "No data uploaded" message)
      if (!parsedData?.data || parsedData.data.length === 0) {
        return []; // Graceful fallback
      }

      // If no meters selected, show "Please select meters" notification
      if (!meterIds || meterIds.length === 0) {
        return [{
          leftIcon: notification,
          rightIcon: blue_info,
          leftBg: "#E7E8EA",
          rightBg: "#E5EBF5",
          title: "Keine Wohnungen ausgewählt",
          subtitle: "Bitte wählen Sie Wohnungen aus, um Benachrichtigungen anzuzeigen.",
        }];
      }
      
      const dynamicNotifications: NotificationItem[] = [];
      
      // Find meters with actual errors that are currently selected
      const selectedMetersWithErrors = parsedData.data.filter(device => {
        const meterId = device.ID?.toString();
        const hasErrorFlag = device["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"] && 
                            device["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"] !== "0b" &&
                            device["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"] !== "";
        
        // Check if this meter is selected AND has actual errors
        return meterId && meterIds.includes(meterId) && hasErrorFlag;
      });

      // If no errors detected, show success notification
      if (selectedMetersWithErrors.length === 0 && parsedData.data.length > 0) {
        const totalDevices = parsedData.data.length;
        const heatDevices = parsedData.data.filter(
          (d) => d["Device Type"] === "Heat" || d["Device Type"] === "WMZ Rücklauf" || d["Device Type"] === "Heizkostenverteiler"
        ).length;
        const waterDevices = parsedData.data.filter(
          (d) => d["Device Type"] === "Water" || d["Device Type"] === "WWater" || 
                 d["Device Type"] === "Kaltwasserzähler" || d["Device Type"] === "Warmwasserzähler"
        ).length;
        const elecDevices = parsedData.data.filter(
          (d) => d["Device Type"] === "Elec" || d["Device Type"] === "Stromzähler"
        ).length;

        dynamicNotifications.push({
          leftIcon: notification,
          rightIcon: green_check,
          leftBg: "#E7E8EA",
          rightBg: "#E7F2E8",
          title: "Alle Zähler funktionieren korrekt",
          subtitle: `${totalDevices} Geräte ohne Fehler (${heatDevices} Wärme, ${waterDevices} Wasser${elecDevices > 0 ? `, ${elecDevices} Strom` : ''})`,
        });

        return dynamicNotifications;
      }

      // Generate notifications for selected meters with errors
      selectedMetersWithErrors.forEach(device => {
        const meterId = device.ID?.toString();
        const deviceType = device["Device Type"];
        const manufacturer = device.Manufacturer;
        const errorFlag = device["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"];
        
        // Determine severity based on error type
        const severity = errorFlag?.includes("1") ? "critical" : "high";
        const rightIcon = severity === "critical" ? alert_triangle : alert_triangle;
        const rightBg = severity === "critical" ? "#FFE5E5" : "#F7E7D5";
        
        // Get appropriate left icon based on device type
        const leftIcon = deviceType === "Heat" ? heater : 
                        deviceType === "WWater" ? hot_water :
                        deviceType === "Water" ? cold_water : pipe_water;
        
        dynamicNotifications.push({
          leftIcon: leftIcon,
          rightIcon: rightIcon,
          leftBg: "#E7E8EA",
          rightBg: rightBg,
          title: `Live Fehler - Zähler ${meterId}`,
          subtitle: `${deviceType} Gerät meldet Fehler (${manufacturer})`,
          meterId: parseInt(meterId || "0")
        });
      });

      // Limit to max 4 dynamic notifications (can fill all slots if needed)
      return dynamicNotifications.slice(0, 4);
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
          (d) => d["Device Type"] === "Heat" || d["Device Type"] === "WMZ Rücklauf" || d["Device Type"] === "Heizkostenverteiler"
        ).length;
        const waterDevices = parsedData.data.filter(
          (d) => d["Device Type"] === "Water" || d["Device Type"] === "WWater" || 
                 d["Device Type"] === "Kaltwasserzähler" || d["Device Type"] === "Warmwasserzähler"
        ).length;
        const elecDevices = parsedData.data.filter(
          (d) => d["Device Type"] === "Elec" || d["Device Type"] === "Stromzähler"
        ).length;

        notifications.push({
          leftIcon: getLeftIconForNotificationType("success", "general"),
          rightIcon: green_check,
          leftBg: "#E7E8EA",
          rightBg: "#E7F2E8",
          title: "Alle Zähler funktionieren korrekt",
          subtitle: `${totalDevices} Geräte ohne Fehler (${heatDevices} Wärme, ${waterDevices} Wasser${elecDevices > 0 ? `, ${elecDevices} Strom` : ''})`,
        });

        return notifications;
      }

      const errorsBySeverity = groupErrorsBySeverity(deviceErrors);

      // if (errorsBySeverity.critical.length > 0) {
      //   notifications.push({
      //     leftIcon: getLeftIconForNotificationType("critical", "general"),
      //     rightIcon: alert_triangle,
      //     leftBg: "#E7E8EA",
      //     rightBg: "#FFE5E5",
      //     title: "criticale Zählerfehler",
      //     subtitle: `${errorsBySeverity.critical.length} Geräte mit schwerwiegenden Problemen`,
      //   });
      // }

      // if (errorsBySeverity.high.length > 0) {
      //   notifications.push({
      //     leftIcon: getLeftIconForNotificationType("sensor", "general"),
      //     rightIcon: alert_triangle,
      //     leftBg: "#E7E8EA",
      //     rightBg: "#F7E7D5",
      //     title: "Wichtige Zählerfehler",
      //     subtitle: `${errorsBySeverity.high.length} Geräte mit Sensor- oder Kommunikationsfehlern`,
      //   });
      // }

      if (errorsBySeverity.medium.length > 0) {
        // notifications.push({
        //   leftIcon: getLeftIconForNotificationType('maintenance', 'general'),
        //   rightIcon: blue_info,
        //   leftBg: "#E7E8EA",
        //   rightBg: "#E5EBF5",
        //   title: "Wartungshinweise",
        //   subtitle: `${errorsBySeverity.medium.length} Geräte benötigen Wartung`,
        // });
        // notifications.push({
        //   leftIcon: getLeftIconForNotificationType("maintenance", "general"),
        //   rightIcon: blue_info,
        //   leftBg: "#E7E8EA",
        //   rightBg: "#E5EBF5",
        //   title: "Wartungshinweise",
        //   subtitle: `1x Rauchwarnmelder wurde entfernt`,
        // });
      }

      // if (errorsBySeverity.low.length > 0) {
      //   notifications.push({
      //     leftIcon: getLeftIconForNotificationType("info", "general"),
      //     rightIcon: blue_info,
      //     leftBg: "#E7E8EA",
      //     rightBg: "#E5EBF5",
      //     title: "Geringfügige Probleme",
      //     subtitle: `${errorsBySeverity.low.length} Geräte mit kleinen Problemen`,
      //   });
      // }

      const errorsByDeviceType = groupErrorsByDeviceType(deviceErrors);

      if (notifications.length < 3) {
        if (errorsByDeviceType.Heat && errorsByDeviceType.Heat.length > 0) {
          // notifications.push({
          //   leftIcon: getLeftIconForNotificationType("problems", "Heat"),
          //   rightIcon: alert_triangle,
          //   leftBg: "#E7E8EA",
          //   rightBg: "#F7E7D5",
          //   title: "Wärmezähler Probleme",
          //   subtitle: `${errorsByDeviceType.Heat.length} Wärmezähler melden Fehler`,
          // });
        }

        if (errorsByDeviceType.Water && errorsByDeviceType.Water.length > 0) {
          // notifications.push({
          //   leftIcon: getLeftIconForNotificationType("problems", "Water"),
          //   rightIcon: alert_triangle,
          //   leftBg: "#E7E8EA",
          //   rightBg: "#F7E7D5",
          //   title: "Wasserzähler Probleme",
          //   subtitle: `${errorsByDeviceType.Water.length} Wasserzähler melden Fehler`,
          // });
        }

        if (errorsByDeviceType.WWater && errorsByDeviceType.WWater.length > 0) {
          // notifications.push({
          //   leftIcon: getLeftIconForNotificationType("problems", "WWater"),
          //   rightIcon: alert_triangle,
          //   leftBg: "#E7E8EA",
          //   rightBg: "#F7E7D5",
          //   title: "Warmwasserzähler Probleme",
          //   subtitle: `${errorsByDeviceType.WWater.length} Warmwasserzähler melden Fehler`,
          // });
        }
      }

      // Check dummy notifications based on selected meter categories
      for (const notification of dummy_notifications) {
        const meterId = notification.ID.toString();
        const category = notification.Category;

        // Check if the notification's meter ID is in the selected meters
        // OR if any meter from the same category is selected
        const isMeterSelected = meterIds.includes(meterId);

        if (isMeterSelected) {
          const rightIcon =
            notification.Severity === "critical"
              ? alert_triangle
              : notification.Severity === "high"
              ? alert_triangle
              : blue_info;

          const rightBg =
            notification.Severity === "critical"
              ? "#FFE5E5"
              : notification.Severity === "high"
              ? "#F7E7D5"
              : "#E5EBF5";

          // Pass the full message to get the correct icon for consumption notifications
          const notificationTypeWithMessage =
            notification["Notification Type"] +
            " " +
            notification["Notification Message"];

          notifications.push({
            leftIcon: getLeftIconForNotificationType(
              notificationTypeWithMessage
            ),
            rightIcon: rightIcon,
            leftBg: "#E7E8EA",
            rightBg: rightBg,
            title: `${notification["Notification Type"]} - Zähler ${notification.ID}`,
            subtitle: notification["Notification Message"],
          });
        }
      }

      return notifications.slice(0, 4);
    };

    // Prevent unnecessary re-renders
    if (!parsedData || isEmpty) {
      setNotifications([]);
      setNotificationQueue([]);
      return;
    }

    // Combine dynamic and existing notifications based on user type
    try {
      // Demo account (heidi@hausverwaltung.de) shows dummy notifications
      // Live users see real error-based notifications
      const finalNotifications = isDemoAccount 
        ? generateNotifications()  // Shows dummy_notifications for demo
        : generateDynamicNotifications();  // Shows real errors for live users
      
      // Split into displayed (first 4) and queue (rest)
      const displayed = finalNotifications.slice(0, 4);
      const queue = finalNotifications.slice(4);
      
      // Update both displayed notifications and queue
      setNotificationQueue(queue);
      setNotifications(displayed);
    } catch (error) {
      // Fallback to existing logic if anything fails
      console.warn('Notifications generation failed:', error);
      const fallback = generateNotifications();
      setNotifications(fallback);
    }
    // Use stable values in dependencies to prevent infinite loops
  }, [isEmpty, parsedData?.data?.length, meterIds?.length, isDemoAccount]);

  const hasDeviceErrors =
    !isEmpty && parsedData?.data && getDevicesWithErrors(parsedData).length > 0;

  return (
    <div
      className={`rounded-2xl shadow p-4 bg-white px-5 h-full flex flex-col ${
        isEmpty ? "flex flex-col" : ""
      }`}
    >
      <div className="flex pb-6 border-b border-b-dark_green/10 items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium max-small:text-sm max-medium:text-sm text-gray-800">
            Benachrichtigungen
          </h2>
          {notificationQueue.length > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              +{notificationQueue.length}
            </span>
          )}
        </div>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="h-5 w-5 max-small:max-w-4 max-small:max-h-4 max-medium:max-w-4 max-medium:max-h-4"
          src={notification}
          alt="notification"
        />
      </div>
      <div className="space-y-2 flex-1 overflow-auto">
        {notifications.length === 0 ? (
          <EmptyState
            title={emptyTitle ?? "No data available."}
            description={emptyDescription ?? "No data available."}
            imageSrc={notification.src}
            imageAlt="Benachrichtigungen"
          />
        ) : (
          notifications.map((n, idx) => (
            <div key={idx} className="flex items-start justify-between w-full">
              <div className="w-full">
                <NotificationItem {...n} />
              </div>
              <div className="mt-1">
                <Popover
                  open={openPopoverId === idx}
                  onOpenChange={(open) => setOpenPopoverId(open ? idx : null)}
                >
                  <PopoverTrigger asChild>
                    <button
                      className="size-4 border-none bg-transparent cursor-pointer flex items-center justify-center flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        loading="lazy"
                        className="max-w-4 max-h-4"
                        src={dots_button}
                        alt="dots button"
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-40 p-2 flex flex-col bg-white border-none shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => openErrorModal(n.meterId)}
                      className="text-xl max-xl:text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md"
                    >
                      <Pencil className="w-4 h-4 max-xl:w-3 max-xl:h-3" />{" "}
                      öffnen
                    </button>
                    <button
                      onClick={() => {
                        deleteNotification(idx);
                      }}
                      className="text-xl max-xl:text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md"
                    >
                      <Trash className="w-4 h-4 max-xl:w-3 max-xl:h-3" />{" "}
                      Löschen
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))
        )}
      </div>
      {/* <>{notifications.length}</> */}
      {hasDeviceErrors && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => openErrorModal()}
            className="text-[10px] text-link text-center underline w-full inline-block mt-[1.5vw] hover:text-blue-600"
          >
            Detaillierte Fehleranalyse anzeigen
          </button>
        </div>
      )}

      <ErrorDetailsModal
        isOpen={isErrorModalOpen}
        onClose={() => {
          setIsErrorModalOpen(false);
          setSelectedMeterId(undefined); // Clear the filter when closing
        }}
        parsedData={parsedData}
        filteredMeterId={selectedMeterId}
      />
    </div>
  );
}
