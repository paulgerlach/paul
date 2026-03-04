"use client";

import { useState, useEffect } from "react";

interface Schedule {
  id: string;
  tenant_login_id: string;
  frequency: "weekly" | "monthly";
  enabled: boolean;
  next_send_at: string | null;
  last_sent_at: string | null;
}

interface ScheduleSettingsProps {
  tenantLoginId: string;
  tenantName: string;
}

export function ScheduleSettings({ tenantLoginId, tenantName }: ScheduleSettingsProps) {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  
  // Local state for UI (before schedule exists)
  const [localFrequency, setLocalFrequency] = useState<"weekly" | "monthly">("weekly");

  // Show saved feedback briefly
  const showSavedFeedback = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // Fetch existing schedule on mount and when tenant changes
  useEffect(() => {
    // Reset state when tenant changes
    setSchedule(null);
    setError(null);
    setShowSaved(false);
    setLocalFrequency("weekly");
    
    async function fetchSchedule() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tenant/schedule/${tenantLoginId}`);
        const data = await res.json();
        if (data.success && data.schedule) {
          setSchedule(data.schedule);
          setLocalFrequency(data.schedule.frequency);
        }
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSchedule();
  }, [tenantLoginId]);

  // Create schedule
  const handleCreate = async (frequency: "weekly" | "monthly") => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/tenant/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_login_id: tenantLoginId, frequency }),
      });
      const data = await res.json();
      if (data.success) {
        setSchedule(data.schedule);
        showSavedFeedback();
      } else {
        setError(data.error || "Fehler beim Erstellen");
      }
    } catch (err) {
      console.error("Create schedule error:", err);
      setError("Netzwerkfehler");
    } finally {
      setSaving(false);
    }
  };

  // Update schedule
  const handleUpdate = async (updates: { frequency?: "weekly" | "monthly"; enabled?: boolean }) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/tenant/schedule/${tenantLoginId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setSchedule(data.schedule);
        showSavedFeedback();
      } else {
        setError(data.error || "Fehler beim Aktualisieren");
      }
    } catch (err) {
      console.error("Update schedule error:", err);
      setError("Netzwerkfehler");
    } finally {
      setSaving(false);
    }
  };

  // Handle toggle change
  const handleToggleChange = async () => {
    if (!schedule) {
      // No schedule exists - create one with current frequency
      await handleCreate(localFrequency);
    } else {
      // Schedule exists - toggle enabled state
      await handleUpdate({ enabled: !schedule.enabled });
    }
  };

  // Handle frequency change
  const handleFrequencyChange = async (newFrequency: "weekly" | "monthly") => {
    setLocalFrequency(newFrequency);
    
    // Always call API when frequency changes - the dropdown is only enabled 
    // when schedule exists and is active, so we can rely on that guard
    await handleUpdate({ frequency: newFrequency });
  };

  // Format date for German display
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Determine if reminders are active
  const isActive = schedule?.enabled ?? false;

  if (loading) {
    return (
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-600">Laden...</p>
      </div>
    );
  }

  return (
    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-3">
      <p className="text-sm font-medium text-dark_text">
        📧 E-Mail-Erinnerungen
      </p>

      {/* Enable/Disable toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">Aktiv</span>
        <button
          onClick={handleToggleChange}
          disabled={saving}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            isActive ? "bg-green" : "bg-gray-300"
          } ${saving ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Frequency selector - always visible */}
      <div className="flex items-center justify-between">
        <span className={`text-sm ${isActive ? "text-gray-700" : "text-gray-400"}`}>
          Häufigkeit
        </span>
        <select
          value={localFrequency}
          onChange={(e) => handleFrequencyChange(e.target.value as "weekly" | "monthly")}
          disabled={saving || !isActive}
          className={`px-2 py-1 text-sm border border-gray-300 rounded bg-white ${
            !isActive ? "opacity-50 cursor-not-allowed" : ""
          } ${saving ? "cursor-wait" : ""}`}
        >
          <option value="weekly">Wöchentlich</option>
          <option value="monthly">Monatlich</option>
        </select>
      </div>

      {/* Next send date - only when active */}
      {isActive && schedule?.next_send_at && (
        <div className="text-xs text-gray-500">
          Nächste E-Mail: {formatDate(schedule.next_send_at)}
        </div>
      )}

      {/* Last sent date */}
      {schedule?.last_sent_at && (
        <div className="text-xs text-gray-500">
          Zuletzt gesendet: {formatDate(schedule.last_sent_at)}
        </div>
      )}

      {/* Saved feedback */}
      {showSaved && (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <span>✓</span> Gespeichert
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

export default ScheduleSettings;
