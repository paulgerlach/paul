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
	smoke_detector,
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
	interpretErrorFlags,
} from "@/utils/errorFlagInterpreter";
import { interpretHintCode } from "@/utils/hintCodeInterpreter";
import { checkRSSI } from "@/utils/rssiChecker";
import {
	analyzeConsumption,
	getConsumptionNotifications,
} from "@/utils/consumptionAnalyzer";
import { StaticImageData } from "next/image";
import { useChartStore } from "@/store/useChartStore";
import { Pencil, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { useAuthUser } from "@/apiClient";
import { useTenantNotifications } from "@/hooks/useTenantNotifications";

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
	userId?: string;
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
	userId,
}: NotificationsChartProps) {
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [selectedMeterId, setSelectedMeterId] = useState<number | undefined>(
		undefined
	);
	const { meterIds } = useChartStore();
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const [notificationQueue, setNotificationQueue] = useState<
		NotificationItem[]
	>([]);
	const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
	const { data: user } = useAuthUser();
	const { notifications: tenantNotifications } = useTenantNotifications(userId || user?.id);

	// Track if user has dismissed notifications (for better UX when all are dismissed)
	const [hasDismissedNotifications, setHasDismissedNotifications] =
		useState(false);
	const [originalNotificationCount, setOriginalNotificationCount] =
		useState(0);
	const [showAllNotifications, setShowAllNotifications] = useState(false);

	// Check if current user is the demo account (only heidi@hausverwaltung.com sees dummy notifications)
	const isDemoAccount = user?.email === "heidi@hausverwaltung.com";

	const openErrorModal = (meterId?: number) => {
		setSelectedMeterId(meterId);
		setIsErrorModalOpen(true);
		setOpenPopoverId(null); // Close the popover
	};

	const deleteNotification = (index: number) => {
		setHasDismissedNotifications(true); // Track that user has dismissed notifications
		setNotifications((prev) => {
			const newNotifications = prev.filter((_, i) => i !== index);

			// If we have fewer than 10 notifications and there are items in the queue, add the next one
			if (newNotifications.length < 10 && notificationQueue.length > 0) {
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
			return smoke_detector; // smoke detector icon
		}
		if (
			type.includes("verbrauchsanstieg") ||
			type.includes("consumption")
		) {
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
				return [
					{
						leftIcon: notification,
						rightIcon: blue_info,
						leftBg: "#E7E8EA",
						rightBg: "#E5EBF5",
						title: "Keine Wohnungen ausgewählt",
						subtitle:
							"Bitte wählen Sie Wohnungen aus, um Benachrichtigungen anzuzeigen.",
					},
				];
			}

			const dynamicNotifications: NotificationItem[] = [];

			// Filter to only selected meters
			// CRITICAL FIX: Detect if meterIds are UUIDs (main dashboard) or serial numbers (shared dashboard)
			// UUIDs contain dashes, serial numbers are just digits
			// For main dashboard: API already filters by UUIDs, so we use all data
			// For shared dashboard: meterIds are serial numbers, so we filter by device.ID
			const isUuidFormat =
				meterIds.length > 0 && meterIds[0]?.includes("-");

			const selectedMeters = isUuidFormat
				? parsedData.data // Main dashboard: data is already filtered by API using UUIDs
				: parsedData.data.filter((device) => {
					// Shared dashboard: filter by serial number
					const meterId =
						device.ID?.toString() ||
						device["Number Meter"]?.toString();
					return meterId && meterIds.includes(meterId);
				});

			// GROUP 1: Check for error flags
			const selectedMetersWithErrors = selectedMeters.filter((device) => {
				const hasErrorFlag =
					device[
					"IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"
					] &&
					device[
					"IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"
					] !== "0b" &&
					device[
					"IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"
					] !== "";
				return hasErrorFlag;
			});

			// =========================================================================
			// DISABLED: Hint Code and RSSI checking - These fields don't exist in CSV
			// The Engelmann gateway CSV format doesn't output "Hint Code" or "RSSI Value"
			// Keeping code commented for future if data format changes
			// =========================================================================

			// GROUP 2: Hint codes - DISABLED (field doesn't exist in CSV data)
			// const selectedMetersWithHintCodes = selectedMeters.filter(device => {
			//   const hintCode = device["Hint Code"];
			//   return hintCode && hintCode !== "0" && hintCode !== 0 && hintCode !== "";
			// });
			const selectedMetersWithHintCodes: typeof selectedMeters = []; // Empty - no hint codes in data

			// GROUP 2: RSSI warnings - DISABLED (field doesn't exist in CSV data)
			// const selectedMetersWithRSSIWarnings = selectedMeters.filter(device => {
			//   const rssiValue = device["RSSI Value"];
			//   if (!rssiValue) return false;
			//   const rssi = typeof rssiValue === "number" ? rssiValue : parseInt(String(rssiValue).replace(/[^\d-]/g, ''));
			//   return !isNaN(rssi) && rssi < -90;
			// });
			const selectedMetersWithRSSIWarnings: typeof selectedMeters = []; // Empty - no RSSI in data

			// GROUP 3: Consumption anomalies are now handled below (before success check)
			// The consumption analyzer groups readings by device and calculates spikes

			// FIRST: Generate consumption notifications (must happen before success check!)
			// This analyzes whether there are actual consumption spikes, not just whether data exists
			let consumptionNotificationsGenerated: NotificationItem[] = [];
			if (selectedMeters.length > 0) {
				// Pass ALL selected meters to consumption analyzer - it will group by device
				consumptionNotificationsGenerated = getConsumptionNotifications(
					{
						data: selectedMeters,
					}
				);
			}

			// Count total ACTUAL issues (including consumption notifications that were generated)
			const totalIssues =
				selectedMetersWithErrors.length +
				selectedMetersWithHintCodes.length +
				selectedMetersWithRSSIWarnings.length +
				consumptionNotificationsGenerated.length;

			// If no issues detected, show success notification
			if (totalIssues === 0 && parsedData.data.length > 0) {
				// Count UNIQUE devices by device ID, not total data rows
				const uniqueDeviceIds = new Set(
					parsedData.data
						.map(
							(d) =>
								d.ID?.toString() ||
								d["Number Meter"]?.toString()
						)
						.filter(Boolean)
				);
				const totalDevices = uniqueDeviceIds.size;

				const uniqueHeatIds = new Set(
					parsedData.data
						.filter(
							(d) =>
								d["Device Type"] === "Heat" ||
								d["Device Type"] === "WMZ Rücklauf" ||
								d["Device Type"] === "Heizkostenverteiler"
						)
						.map(
							(d) =>
								d.ID?.toString() ||
								d["Number Meter"]?.toString()
						)
						.filter(Boolean)
				);
				const heatDevices = uniqueHeatIds.size;

				const uniqueColdWaterIds = new Set(
					parsedData.data
						.filter(
							(d) =>
								d["Device Type"] === "Water" ||
								d["Device Type"] === "Kaltwasserzähler"
						)
						.map(
							(d) =>
								d.ID?.toString() ||
								d["Number Meter"]?.toString()
						)
						.filter(Boolean)
				);
				const coldWaterDevices = uniqueColdWaterIds.size;

				const uniqueHotWaterIds = new Set(
					parsedData.data
						.filter(
							(d) =>
								d["Device Type"] === "WWater" ||
								d["Device Type"] === "Warmwasserzähler"
						)
						.map(
							(d) =>
								d.ID?.toString() ||
								d["Number Meter"]?.toString()
						)
						.filter(Boolean)
				);
				const hotWaterDevices = uniqueHotWaterIds.size;

				const uniqueElecIds = new Set(
					parsedData.data
						.filter(
							(d) =>
								d["Device Type"] === "Elec" ||
								d["Device Type"] === "Stromzähler"
						)
						.map(
							(d) =>
								d.ID?.toString() ||
								d["Number Meter"]?.toString()
						)
						.filter(Boolean)
				);
				const elecDevices = uniqueElecIds.size;

				// Build subtitle with all 4 categories
				const parts = [];
				if (heatDevices > 0) parts.push(`${heatDevices} Wärme`);
				if (coldWaterDevices > 0)
					parts.push(`${coldWaterDevices} Kaltwasser`);
				if (hotWaterDevices > 0)
					parts.push(`${hotWaterDevices} Warmwasser`);
				if (elecDevices > 0) parts.push(`${elecDevices} Strom`);

				dynamicNotifications.push({
					leftIcon: notification,
					rightIcon: green_check,
					leftBg: "#E7E8EA",
					rightBg: "#E7F2E8",
					title: "Alle Zähler funktionieren korrekt",
					subtitle: `${totalDevices} Geräte ohne Fehler (${parts.join(
						", "
					)})`,
				});

				return dynamicNotifications;
			}

			// GROUP 1: Generate notifications for error flags
			selectedMetersWithErrors.forEach((device) => {
				const meterId =
					device.ID?.toString() || device["Number Meter"]?.toString();
				const deviceType = device["Device Type"];
				const manufacturer = device.Manufacturer;
				const errorFlag =
					device["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"];

				// Determine severity based on error type
				const severity = errorFlag?.includes("1") ? "critical" : "high";
				const rightIcon =
					severity === "critical" ? alert_triangle : alert_triangle;
				const rightBg = severity === "critical" ? "#FFE5E5" : "#F7E7D5";

				// Get appropriate left icon based on device type
				const leftIcon =
					deviceType === "Heat"
						? heater
						: deviceType === "WWater"
							? hot_water
							: deviceType === "Water"
								? cold_water
								: pipe_water;

				dynamicNotifications.push({
					leftIcon: leftIcon,
					rightIcon: rightIcon,
					leftBg: "#E7E8EA",
					rightBg: rightBg,
					title: `Gerätefehler - Zähler ${meterId}`,
					subtitle: `${deviceType} Gerät meldet technischen Fehler (${manufacturer})`,
					meterId: parseInt(meterId || "0"),
				});
			});

			// =========================================================================
			// DISABLED: Hint Code and RSSI notification generation
			// These arrays are always empty because the fields don't exist in CSV data
			// =========================================================================

			// GROUP 2: Generate notifications for hint codes - DISABLED
			// selectedMetersWithHintCodes.forEach(device => {
			//   const hintNotification = interpretHintCode(device);
			//   if (hintNotification) {
			//     dynamicNotifications.push(hintNotification);
			//   }
			// });

			// GROUP 2: Generate notifications for RSSI warnings - DISABLED
			// selectedMetersWithRSSIWarnings.forEach(device => {
			//   const rssiNotification = checkRSSI(device);
			//   if (rssiNotification) {
			//     dynamicNotifications.push(rssiNotification);
			//   }
			// });

			// GROUP 3: Add consumption notifications
			if (consumptionNotificationsGenerated.length > 0) {
				dynamicNotifications.push(...consumptionNotificationsGenerated);
			}

			// GROUP 4: Add tenant/apartment notifications
			if (tenantNotifications && tenantNotifications.length > 0) {
				dynamicNotifications.push(...tenantNotifications);
			}

			// GROUP 5: Admin-only notifications (Battery Warning)
			const isAdmin = user?.permission === "admin" || user?.permission === "super_admin" || user?.permission === "agency_admin";

			if (isAdmin) {
				selectedMeters.forEach(device => {
					const errorInterpretation = interpretErrorFlags(device);
					if (errorInterpretation?.errors) {
						// Check for battery issues
						const hasBatteryIssue = errorInterpretation.errors.some(e =>
							e.includes("Batterie") || e.includes("battery")
						);

						if (hasBatteryIssue) {
							const meterId = device.ID || device["Number Meter"];
							const deviceType = device["Device Type"];

							// Get appropriate left icon based on device type
							let leftIcon = notification;
							if (deviceType === "Heat" || deviceType === "Wärme") leftIcon = heater;
							else if (deviceType === "WWater" || deviceType === "Warmwasser") leftIcon = hot_water;
							else if (deviceType === "Water" || deviceType === "Kaltwasser") leftIcon = cold_water;

							dynamicNotifications.push({
								leftIcon: leftIcon,
								rightIcon: caract_battery,
								leftBg: "#E7E8EA",
								rightBg: "#F7E7D5", // Orange
								title: "Schwache Batterie",
								subtitle: `${deviceType}zähler ${meterId} - Batterie bald wechseln`,
								meterId: typeof meterId === "string" ? parseInt(meterId) : meterId
							});
						}
					}
				});
			}

			// Sort by severity (critical > high > medium > low)
			const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
			dynamicNotifications.sort((a, b) => {
				const aSeverity =
					"severity" in a ? (a as any).severity : "medium";
				const bSeverity =
					"severity" in b ? (b as any).severity : "medium";
				return (
					(severityOrder[aSeverity as keyof typeof severityOrder] ||
						2) -
					(severityOrder[bSeverity as keyof typeof severityOrder] ||
						2)
				);
			});

			// Limit to max 4 dynamic notifications (highest severity first)
			return dynamicNotifications.slice(0, 10);
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
				// Count UNIQUE devices by device ID, not total data rows
				const uniqueDeviceIds = new Set(
					parsedData.data
						.map(
							(d) =>
								d.ID?.toString() ||
								d["Number Meter"]?.toString()
						)
						.filter(Boolean)
				);
				const totalDevices = uniqueDeviceIds.size;

				const uniqueHeatIds = new Set(
					parsedData.data
						.filter(
							(d) =>
								d["Device Type"] === "Heat" ||
								d["Device Type"] === "WMZ Rücklauf" ||
								d["Device Type"] === "Heizkostenverteiler"
						)
						.map(
							(d) =>
								d.ID?.toString() ||
								d["Number Meter"]?.toString()
						)
						.filter(Boolean)
				);
				const heatDevices = uniqueHeatIds.size;

				const uniqueColdWaterIds = new Set(
					parsedData.data
						.filter(
							(d) =>
								d["Device Type"] === "Water" ||
								d["Device Type"] === "Kaltwasserzähler"
						)
						.map(
							(d) =>
								d.ID?.toString() ||
								d["Number Meter"]?.toString()
						)
						.filter(Boolean)
				);
				const coldWaterDevices = uniqueColdWaterIds.size;

				const uniqueHotWaterIds = new Set(
					parsedData.data
						.filter(
							(d) =>
								d["Device Type"] === "WWater" ||
								d["Device Type"] === "Warmwasserzähler"
						)
						.map(
							(d) =>
								d.ID?.toString() ||
								d["Number Meter"]?.toString()
						)
						.filter(Boolean)
				);
				const hotWaterDevices = uniqueHotWaterIds.size;

				const uniqueElecIds = new Set(
					parsedData.data
						.filter(
							(d) =>
								d["Device Type"] === "Elec" ||
								d["Device Type"] === "Stromzähler"
						)
						.map(
							(d) =>
								d.ID?.toString() ||
								d["Number Meter"]?.toString()
						)
						.filter(Boolean)
				);
				const elecDevices = uniqueElecIds.size;

				// Build subtitle with all 4 categories
				const categoryParts = [];
				if (heatDevices > 0) categoryParts.push(`${heatDevices} Wärme`);
				if (coldWaterDevices > 0)
					categoryParts.push(`${coldWaterDevices} Kaltwasser`);
				if (hotWaterDevices > 0)
					categoryParts.push(`${hotWaterDevices} Warmwasser`);
				if (elecDevices > 0) categoryParts.push(`${elecDevices} Strom`);

				// For demo account, skip success message and show dummy notifications instead
				if (!isDemoAccount) {
					notifications.push({
						leftIcon: getLeftIconForNotificationType(
							"success",
							"general"
						),
						rightIcon: green_check,
						leftBg: "#E7E8EA",
						rightBg: "#E7F2E8",
						title: "Alle Zähler funktionieren korrekt",
						subtitle: `${totalDevices} Geräte ohne Fehler (${categoryParts.join(
							", "
						)})`,
					});

					return notifications;
				}
				// Demo account continues to dummy notifications below
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
				if (
					errorsByDeviceType.Heat &&
					errorsByDeviceType.Heat.length > 0
				) {
					// notifications.push({
					//   leftIcon: getLeftIconForNotificationType("problems", "Heat"),
					//   rightIcon: alert_triangle,
					//   leftBg: "#E7E8EA",
					//   rightBg: "#F7E7D5",
					//   title: "Wärmezähler Probleme",
					//   subtitle: `${errorsByDeviceType.Heat.length} Wärmezähler melden Fehler`,
					// });
				}

				if (
					errorsByDeviceType.Water &&
					errorsByDeviceType.Water.length > 0
				) {
					// notifications.push({
					//   leftIcon: getLeftIconForNotificationType("problems", "Water"),
					//   rightIcon: alert_triangle,
					//   leftBg: "#E7E8EA",
					//   rightBg: "#F7E7D5",
					//   title: "Wasserzähler Probleme",
					//   subtitle: `${errorsByDeviceType.Water.length} Wasserzähler melden Fehler`,
					// });
				}

				if (
					errorsByDeviceType.WWater &&
					errorsByDeviceType.WWater.length > 0
				) {
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
			// For demo account, always show dummy notifications regardless of meter selection
			for (const notification of dummy_notifications) {
				const meterId = notification.ID.toString();
				const category = notification.Category;

				// Demo account always shows dummy notifications
				// Live users would need matching meter IDs (but they use generateDynamicNotifications instead)
				const shouldShowDummy =
					isDemoAccount || meterIds.includes(meterId);

				if (shouldShowDummy) {
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

			return notifications.slice(0, 10);
		};

		// Reset dismissed state when data changes (new data load)
		setHasDismissedNotifications(false);

		// Prevent unnecessary re-renders
		if (!parsedData || isEmpty) {
			setNotifications([]);
			setNotificationQueue([]);
			setOriginalNotificationCount(0);
			return;
		}

		// Combine dynamic and existing notifications based on user type
		try {
			// Demo account (heidi@hausverwaltung.de) shows dummy notifications
			// Live users see real error-based notifications
			const finalNotifications = isDemoAccount
				? generateNotifications() // Shows dummy_notifications for demo
				: generateDynamicNotifications(); // Shows real errors for live users

			// Track original count for better UX messaging
			setOriginalNotificationCount(finalNotifications.length);

			// Split into displayed (first 10, scrollable) and queue (rest)
			const displayed = finalNotifications.slice(0, 10);
			const queue = finalNotifications.slice(10);

			// Update both displayed notifications and queue
			setNotificationQueue(queue);
			setNotifications(displayed);
		} catch (error) {
			// Fallback to existing logic if anything fails
			console.warn("Notifications generation failed:", error);
			const fallback = generateNotifications();
			setOriginalNotificationCount(fallback.length);
			setNotifications(fallback);
		}
		// Use stable values in dependencies to prevent infinite loops
	}, [isEmpty, parsedData?.data?.length, meterIds?.length, isDemoAccount]);

	const hasDeviceErrors =
		!isEmpty &&
		parsedData?.data &&
		getDevicesWithErrors(parsedData).length > 0;

	return (
		<div
			className={`rounded-2xl shadow p-4 bg-white px-5 h-full flex flex-col ${isEmpty ? "flex flex-col" : ""
				}`}
		>
			<div className="flex pb-3 border-b border-b-dark_green/10 items-center justify-between mb-2">
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
			<div
				className={`flex-1 overflow-y-auto ${showAllNotifications ? "max-h-[280px]" : "max-h-[270px]"
					} pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
			>
				{notifications.length === 0 ? (
					hasDismissedNotifications &&
						originalNotificationCount > 0 ? (
						// User dismissed all notifications - show success state
						<EmptyState
							title="Alle Warnungen gelöscht"
							description={`${originalNotificationCount} ${originalNotificationCount === 1
								? "Warnung wurde"
								: "Warnungen wurden"
								} bestätigt. Bei Aktualisierung werden offene Probleme erneut angezeigt.`}
							imageSrc={notification.src}
							imageAlt="Benachrichtigungen"
						/>
					) : (
						// Genuinely no data or no notifications
						<EmptyState
							title={emptyTitle ?? "No data available."}
							description={
								emptyDescription ?? "No data available."
							}
							imageSrc={notification.src}
							imageAlt="Benachrichtigungen"
						/>
					)
				) : (
					notifications
						.slice(
							0,
							showAllNotifications ? notifications.length : 4
						)
						.map((n, idx) => (
							<div
								key={idx}
								className="flex items-center w-full rounded-base border border-transparent hover:bg-base-bg/70 hover:border-base-bg"
							>
								<div className="flex-1 min-w-0">
									<NotificationItem {...n} />
								</div>
								<div className="flex items-center flex-shrink-0 ml-1">
									<Popover
										open={openPopoverId === idx}
										onOpenChange={(open) =>
											setOpenPopoverId(open ? idx : null)
										}
									>
										<PopoverTrigger asChild>
											<button
												className="size-4 border-none bg-transparent cursor-pointer flex items-center justify-center flex-shrink-0"
												onClick={(e) =>
													e.stopPropagation()
												}
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
												onClick={() =>
													openErrorModal(n.meterId)
												}
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
				{notifications.length > 4 && (
					<button
						onClick={() =>
							setShowAllNotifications(!showAllNotifications)
						}
						className="text-[10px] text-link text-center underline w-full inline-block hover:text-blue-600"
					>
						{showAllNotifications
							? "Weniger anzeigen"
							: "Weitere Benachrichtigungen anzeigen"}
					</button>
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
