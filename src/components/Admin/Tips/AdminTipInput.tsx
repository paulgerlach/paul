"use client";

import { Button } from "@/components/Basic/ui/Button";
import { Input } from "@/components/Basic/ui/Input";
import React, { useState } from "react";
import { toast } from "sonner";

export default function AdminTipInput() {
    const [tip, setTip] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!tip.trim()) {
            toast.error("Bitte geben Sie einen Tipp ein.");
            return;
        }

        setIsSaving(true);
        // Simulate API call
        console.log("Saving tip:", tip);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Tipp erfolgreich gespeichert!");
        setTip("");
        setIsSaving(false);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full flex flex-row items-center gap-4">
            <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">Neuer Tipp des Tages:</h3>
            <div className="flex-1">
                <Input
                    placeholder="Geben Sie hier einen neuen Tipp ein..."
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    className="w-full text-sm"
                />
            </div>
            <Button
                onClick={handleSave}
                disabled={isSaving || !tip.trim()}
                className="whitespace-nowrap"
            >
                {isSaving ? "Speichert..." : "Speichern"}
            </Button>
        </div>
    );
}
