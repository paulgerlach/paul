"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/Basic/ui/Switch";
import { toast } from "sonner";
import {
  getRegistrationStatus,
  updateRegistrationStatus,
} from "@/actions/system-settings";

export default function RegistrationToggle() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Load current status on mount
  useEffect(() => {
    async function loadStatus() {
      const { enabled: currentStatus, error } = await getRegistrationStatus();
      if (error) {
        toast.error("Failed to load registration status");
        console.error(error);
      }
      setEnabled(currentStatus);
      setLoading(false);
    }
    loadStatus();
  }, []);

  const handleToggle = async (checked: boolean) => {
    setUpdating(true);
    const { success, error } = await updateRegistrationStatus(checked);

    if (success) {
      setEnabled(checked);
      toast.success(
        checked
          ? "Registrierung ist jetzt aktiviert"
          : "Registrierung ist jetzt deaktiviert"
      );
    } else {
      toast.error(error || "Fehler beim Aktualisieren der Einstellung");
      console.error(error);
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 max-medium:p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg max-medium:text-base font-semibold text-gray-900 mb-1">
            Neue Registrierungen
          </h3>
          <p className="text-sm max-medium:text-xs text-gray-600">
            {enabled
              ? "Neue Benutzer können sich registrieren"
              : "Registrierung ist gesperrt"}
          </p>
        </div>
        <div className="ml-4 max-medium:ml-2 flex-shrink-0">
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={updating}
            className="data-[state=checked]:bg-green data-[state=unchecked]:bg-gray-300"
          />
        </div>
      </div>
      {!enabled && (
        <div className="mt-4 max-medium:mt-3 p-3 max-medium:p-2 bg-orange-50 border border-orange-200 rounded-md">
          <p className="text-sm max-medium:text-xs text-orange-800">
            ⚠️ Neue Benutzer können sich derzeit nicht registrieren
          </p>
        </div>
      )}
    </div>
  );
}

