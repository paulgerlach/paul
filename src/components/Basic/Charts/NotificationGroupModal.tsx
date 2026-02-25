"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Pencil, Trash } from "lucide-react";
import Image, { StaticImageData } from "next/image";

export interface GroupNotificationItem {
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

interface NotificationGroupModalProps {
    group: { label: string; color: string; items: GroupNotificationItem[] } | null;
    onClose: () => void;
    onOpenDetail: (item: GroupNotificationItem) => void;
    onDelete: (item: GroupNotificationItem) => void;
}

export default function NotificationGroupModal({
    group,
    onClose,
    onOpenDetail,
    onDelete,
}: NotificationGroupModalProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (group) {
            document.addEventListener("keydown", onKey);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "unset";
        };
    }, [group, onClose]);

    if (!group || !mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: group.color }}
                        />
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Schweregrad</p>
                            <h2 className="text-base font-semibold text-gray-800 leading-tight">{group.label}</h2>
                        </div>
                        <span className="ml-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            {group.items.length} Warnungen
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Notification list */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {group.items.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                        >
                            {/* Icons */}
                            <div className="relative flex-shrink-0">
                                <span
                                    className="flex items-center justify-center w-9 h-9 rounded-xl"
                                    style={{ backgroundColor: item.leftBg }}
                                >
                                    <Image src={item.leftIcon} alt="" width={18} height={18} className="w-4 h-4" />
                                </span>
                                <span
                                    className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full border-2 border-white"
                                    style={{ backgroundColor: item.rightBg }}
                                >
                                    <Image src={item.rightIcon} alt="" width={10} height={10} className="w-2.5 h-2.5" />
                                </span>
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-700 truncate">{item.title}</p>
                                {item.building || item.unit ? (
                                    <p className="text-[10px] text-gray-400 truncate">
                                        {[item.building, item.unit].filter(Boolean).join(" · ")}
                                        {item.tenant ? ` · ${item.tenant}` : ""}
                                    </p>
                                ) : (
                                    <p className="text-[10px] text-gray-400 truncate">{item.subtitle}</p>
                                )}
                            </div>

                            {/* Actions — visible on hover */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                <button
                                    onClick={() => { onOpenDetail(item); }}
                                    className="flex items-center gap-1 text-xs text-dark_green px-2 py-1 rounded-md hover:bg-green/20 transition-all"
                                >
                                    <Pencil className="w-3 h-3" /> öffnen
                                </button>
                                <button
                                    onClick={() => onDelete(item)}
                                    className="flex items-center gap-1 text-xs text-gray-400 px-2 py-1 rounded-md hover:bg-red-50 hover:text-red-500 transition-all"
                                >
                                    <Trash className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 pt-3 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
                    >
                        Schließen
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
