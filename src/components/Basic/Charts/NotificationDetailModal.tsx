"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image, { StaticImageData } from "next/image";
import { X, MapPin, User, Cpu, AlertTriangle, Info } from "lucide-react";

export interface NotificationDetail {
    leftIcon: StaticImageData;
    rightIcon: StaticImageData;
    leftBg: string;
    rightBg: string;
    title: string;
    subtitle: string;
    meterId?: number;
    severity?: string;
    deviceType?: string;
    manufacturer?: string;
    building?: string;
    unit?: string;
    tenant?: string;
}

interface NotificationDetailModalProps {
    notification: NotificationDetail | null;
    onClose: () => void;
}

function SeverityBadge({ severity }: { severity?: string }) {
    if (!severity) return null;
    const map: Record<string, { label: string; bg: string; text: string }> = {
        critical: { label: "Kritisch", bg: "bg-red-100", text: "text-red-700" },
        high: { label: "Hoch", bg: "bg-orange-100", text: "text-orange-700" },
        medium: { label: "Mittel", bg: "bg-yellow-100", text: "text-yellow-700" },
        low: { label: "Niedrig", bg: "bg-blue-100", text: "text-blue-700" },
    };
    const s = map[severity] ?? map.low;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
            {severity === "critical" || severity === "high"
                ? <AlertTriangle className="w-3 h-3" />
                : <Info className="w-3 h-3" />}
            {s.label}
        </span>
    );
}

const DEVICE_TYPE_LABELS: Record<string, string> = {
    // raw CSV values
    Heat: "Wärmezähler",
    Water: "Kaltwasserzähler",
    WWater: "Warmwasserzähler",
    Elec: "Stromzähler",
    HCA: "Heizkostenverteiler",
    // category slugs from dummy data
    heatMeters: "Wärmezähler",
    coldwater: "Kaltwasserzähler",
    hotwater: "Warmwasserzähler",
    electricity: "Stromzähler",
    // German variants
    "Wärme": "Wärmezähler",
    "Warmwasser": "Warmwasserzähler",
    "Kaltwasser": "Kaltwasserzähler",
    "Strom": "Stromzähler",
    "Rauchwarnmelder": "Rauchwarnmelder",
    "Andere": "Sonstige",
};

function labelDeviceType(raw?: string): string | undefined {
    if (!raw) return undefined;
    return DEVICE_TYPE_LABELS[raw] ?? raw;
}

export default function NotificationDetailModal({ notification, onClose }: NotificationDetailModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (notification) {
            document.addEventListener("keydown", onKey);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "unset";
        };
    }, [notification, onClose]);

    if (!notification || !mounted) return null;

    const hasApartmentInfo = notification.building || notification.unit || notification.tenant;

    return createPortal(
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {/* Left icon chip */}
                        <span
                            className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
                            style={{ backgroundColor: notification.leftBg }}
                        >
                            <Image
                                src={notification.leftIcon}
                                alt=""
                                width={22}
                                height={22}
                                className="w-5 h-5"
                            />
                        </span>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Benachrichtigung</p>
                            <h2 className="text-base font-semibold text-gray-800 leading-tight">{notification.title}</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {/* Severity + status icon */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: notification.rightBg }}
                        >
                            <Image
                                src={notification.rightIcon}
                                alt=""
                                width={16}
                                height={16}
                                className="w-4 h-4"
                            />
                        </span>
                        <SeverityBadge severity={notification.severity} />
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-600 leading-relaxed">{notification.subtitle}</p>
                    </div>

                    {/* Detail rows */}
                    <div className="space-y-2.5">
                        {notification.meterId && (
                            <DetailRow icon={<Cpu className="w-4 h-4" />} label="Zähler-ID" value={String(notification.meterId)} />
                        )}
                        {notification.deviceType && (
                            <DetailRow icon={<Cpu className="w-4 h-4" />} label="Gerätetyp" value={labelDeviceType(notification.deviceType)!} />
                        )}
                        {notification.manufacturer && (
                            <DetailRow icon={<Info className="w-4 h-4" />} label="Hersteller" value={notification.manufacturer} />
                        )}
                    </div>

                    {/* Apartment info — only shown if available */}
                    {hasApartmentInfo && (
                        <div className="border border-gray-100 rounded-xl p-4 space-y-2.5">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Wohnungsinfo</p>
                            {notification.building && (
                                <DetailRow icon={<MapPin className="w-4 h-4" />} label="Gebäude" value={notification.building} />
                            )}
                            {notification.unit && (
                                <DetailRow icon={<MapPin className="w-4 h-4" />} label="Wohnung" value={notification.unit} />
                            )}
                            {notification.tenant && (
                                <DetailRow icon={<User className="w-4 h-4" />} label="Mieter" value={notification.tenant} />
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-5">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
                    >
                        Schließen
                    </button>
                </div>
            </div>
        </div>
        , document.body);
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-gray-400 flex-shrink-0">{icon}</span>
            <span className="text-xs text-gray-400 w-20 flex-shrink-0">{label}</span>
            <span className="text-sm text-gray-700 font-medium">{value}</span>
        </div>
    );
}
