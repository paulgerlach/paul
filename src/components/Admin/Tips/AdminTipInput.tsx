"use client";

import { Button } from "@/components/Basic/ui/Button";
import { Input } from "@/components/Basic/ui/Input";
import { Textarea } from "@/components/Basic/ui/Textarea";
import Select from "@/components/Basic/ui/Select";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/database.types";

type Tip = Database["public"]["Tables"]["daily_tips"]["Row"];

export default function AdminTipInput() {
    const [tip, setTip] = useState("");
    const [category, setCategory] = useState<"heating" | "water" | "electricity" | "">("");
    const [season, setSeason] = useState<"winter" | "summer" | "all" | "">("");
    const [isSaving, setIsSaving] = useState(false);
    const [tips, setTips] = useState<Tip[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTipContent, setEditTipContent] = useState("");
    const [editCategory, setEditCategory] = useState<"heating" | "water" | "electricity" | "">("");
    const [editSeason, setEditSeason] = useState<"winter" | "summer" | "all" | "">("");
    const [isLoadingTips, setIsLoadingTips] = useState(true);

    const fetchTips = async () => {
        setIsLoadingTips(true);
        const { data, error } = await supabase
            .from("daily_tips")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Fehler beim Laden der Tipps");
        } else if (data) {
            setTips(data);
        }
        setIsLoadingTips(false);
    };

    useEffect(() => {
        fetchTips();
    }, []);

    const handleSave = async () => {
        if (!tip.trim()) {
            toast.error("Bitte geben Sie einen Tipp ein.");
            return;
        }
        if (!category) {
            toast.error("Bitte wählen Sie eine Kategorie.");
            return;
        }
        if (!season) {
            toast.error("Bitte wählen Sie eine Saison.");
            return;
        }

        setIsSaving(true);
        const { error } = await supabase.from("daily_tips").insert({
            content: tip.trim(),
            category: category as "heating" | "water" | "electricity",
            season: season as "winter" | "summer" | "all",
            is_active: true
        });

        setIsSaving(false);

        if (error) {
            toast.error("Fehler beim Speichern des Tipps.");
        } else {
            toast.success("Tipp erfolgreich gespeichert!");
            setTip("");
            setCategory("");
            setSeason("");
            fetchTips();
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("daily_tips")
            .update({ is_active: !currentStatus })
            .eq("id", id);

        if (error) {
            toast.error("Status konnte nicht geändert werden.");
        } else {
            toast.success("Status aktualisiert.");
            setTips(tips.map(t => t.id === id ? { ...t, is_active: !currentStatus } : t));
        }
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("daily_tips")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Tipp konnte nicht gelöscht werden.");
        } else {
            toast.success("Tipp gelöscht.");
            setTips(tips.filter(t => t.id !== id));
        }
    };

    const startEditing = (t: Tip) => {
        setEditingId(t.id);
        setEditTipContent(t.content);
        setEditCategory(t.category);
        setEditSeason(t.season);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditTipContent("");
        setEditCategory("");
        setEditSeason("");
    };

    const saveEdit = async (id: string) => {
        if (!editTipContent.trim() || !editCategory || !editSeason) {
            toast.error("Bitte füllen Sie alle Felder aus.");
            return;
        }

        const { error } = await supabase
            .from("daily_tips")
            .update({
                content: editTipContent.trim(),
                category: editCategory as "heating" | "water" | "electricity",
                season: editSeason as "winter" | "summer" | "all"
            })
            .eq("id", id);

        if (error) {
            toast.error("Fehler beim Aktualisieren des Tipps.");
        } else {
            toast.success("Tipp erfolgreich aktualisiert!");
            setEditingId(null);
            setTips(tips.map(t => t.id === id ? {
                ...t,
                content: editTipContent.trim(),
                category: editCategory as "heating" | "water" | "electricity",
                season: editSeason as "winter" | "summer" | "all"
            } : t));
        }
    };

    const translateCategory = (cat: string) => {
        switch (cat) {
            case "heating": return "Heizung";
            case "water": return "Wasser";
            case "electricity": return "Strom";
            default: return cat;
        }
    };

    const translateSeason = (s: string) => {
        switch (s) {
            case "winter": return "Winter";
            case "summer": return "Sommer";
            case "all": return "Alle";
            default: return s;
        }
    };

    // Handle click outside modal
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            cancelEditing();
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-gray-700">Neuer Tipp des Tages erstellen</h3>
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1 w-full">
                        <Input
                            placeholder="Geben Sie hier einen neuen Tipp ein..."
                            value={tip}
                            onChange={(e) => setTip(e.target.value)}
                            className="w-full text-sm h-14"
                        />
                    </div>
                    <div className="w-full md:w-36">
                        <Select
                            label="Kategorie"
                            options={["heating", "water", "electricity"]}
                            selectedValue={category}
                            onChange={(val) => setCategory(val as any)}
                            placeholder="Wählen"
                        />
                    </div>
                    <div className="w-full md:w-36">
                        <Select
                            label="Saison"
                            options={["winter", "summer", "all"]}
                            selectedValue={season}
                            onChange={(val) => setSeason(val as any)}
                            placeholder="Wählen"
                        />
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !tip.trim() || !category || !season}
                        className="whitespace-nowrap h-14"
                    >
                        {isSaving ? "Speichert..." : "Speichern"}
                    </Button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-gray-700">Vorhandene Tipps</h3>
                {isLoadingTips ? (
                    <p className="text-sm text-gray-500">Lade Tipps...</p>
                ) : tips.length === 0 ? (
                    <p className="text-sm text-gray-500">Noch keine Tipps vorhanden.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm mx-auto">
                            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-left font-semibold">Tipp</th>
                                    <th className="py-3 px-4 text-left font-semibold w-32">Kategorie</th>
                                    <th className="py-3 px-4 text-left font-semibold w-24">Saison</th>
                                    <th className="py-3 px-4 text-left font-semibold w-24">Status</th>
                                    <th className="py-3 px-4 text-right font-semibold w-64">Aktionen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tips.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 max-w-sm truncate text-gray-800" title={t.content}>{t.content}</td>
                                        <td className="py-3 px-4 text-gray-600">{translateCategory(t.category)}</td>
                                        <td className="py-3 px-4 text-gray-600">{translateSeason(t.season)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${t.is_active ? 'bg-green/10 text-green' : 'bg-red-50 text-red-600'}`}>
                                                {t.is_active ? 'Aktiv' : 'Inaktiv'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right flex justify-end gap-2">
                                            <Button
                                                onClick={() => startEditing(t)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                Bearbeiten
                                            </Button>
                                            <Button
                                                onClick={() => toggleActive(t.id, t.is_active)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                {t.is_active ? 'Deaktivieren' : 'Aktivieren'}
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(t.id)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                Löschen
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {editingId && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-white rounded-lg p-6 max-w-[500px] w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Tipp bearbeiten</h2>
                            <button
                                onClick={cancelEditing}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Tipp Text</label>
                                <Textarea
                                    value={editTipContent}
                                    onChange={(e) => setEditTipContent(e.target.value)}
                                    className="min-h-[120px] w-full p-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green"
                                    placeholder="Geben Sie hier den Tipp ein..."
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Select
                                        label="Kategorie"
                                        options={["heating", "water", "electricity"]}
                                        selectedValue={editCategory}
                                        onChange={(val) => setEditCategory(val as any)}
                                        placeholder="Wählen"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Select
                                        label="Saison"
                                        options={["winter", "summer", "all"]}
                                        selectedValue={editSeason}
                                        onChange={(val) => setEditSeason(val as any)}
                                        placeholder="Wählen"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between items-center">
                            <Button variant="ghost" className="text-gray-500 hover:text-gray-700" onClick={cancelEditing}>
                                Abbrechen
                            </Button>
                            <Button onClick={() => editingId && saveEdit(editingId)}>
                                Speichern
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
