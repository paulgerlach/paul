"use client";

import { useState, useEffect } from "react";
import { BuildingSelector } from "./BuildingSelector";
import { TenantSelector, Tenant } from "./TenantSelector";
import { Button } from "@/components/Basic/ui/Button";

/**
 * TenantInviteSection - Complete tenant invite UI
 * 
 * Includes building selector, tenant selector, bulk invite option.
 * Used in ShareDashboardDialog.
 * NEW COMPONENT - Does not modify any existing code.
 */

interface Building {
  id: string;
  street: string;
  zip: string;
  city?: string;
}

export function TenantInviteSection() {
  // State
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [inviteAll, setInviteAll] = useState(false);
  
  // Loading states
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [toggling, setToggling] = useState(false);
  
  // Result state
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Fetch buildings on mount
  useEffect(() => {
    async function fetchBuildings() {
      setLoadingBuildings(true);
      try {
        const res = await fetch("/api/landlord/buildings");
        const data = await res.json();
        setBuildings(data.buildings || []);
        
        // Log if using mock data
        if (data._mock) {
          console.log("[TenantInviteSection] Using MOCK buildings data");
        }
      } catch (error) {
        console.error("Failed to fetch buildings:", error);
        setBuildings([]);
      } finally {
        setLoadingBuildings(false);
      }
    }
    fetchBuildings();
  }, []);

  // Fetch tenants when building selected
  useEffect(() => {
    async function fetchTenants() {
      if (!selectedBuilding) {
        setTenants([]);
        return;
      }
      
      setLoadingTenants(true);
      try {
        const res = await fetch(`/api/landlord/buildings/${selectedBuilding}/tenants`);
        const data = await res.json();
        setTenants(data.tenants || []);
        
        // Log if using mock data
        if (data._mock) {
          console.log("[TenantInviteSection] Using MOCK tenants data");
        }
      } catch (error) {
        console.error("Failed to fetch tenants:", error);
        setTenants([]);
      } finally {
        setLoadingTenants(false);
      }
    }
    fetchTenants();
  }, [selectedBuilding]);

  // Handle building change
  const handleBuildingChange = (buildingId: string) => {
    setSelectedBuilding(buildingId || null);
    setSelectedTenant(null);
    setInviteAll(false);
    setResult(null);
  };

  // Handle tenant change
  const handleTenantChange = (contractorId: string) => {
    setSelectedTenant(contractorId || null);
    setResult(null);
  };

  // Handle invite all checkbox
  const handleInviteAllChange = (checked: boolean) => {
    setInviteAll(checked);
    if (checked) {
      setSelectedTenant(null);
    }
    setResult(null);
  };

  // Handle invite
  const handleInvite = async () => {
    setInviting(true);
    setResult(null);
    
    try {
      if (inviteAll) {
        // Bulk invite
        const res = await fetch("/api/tenant/invite-bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ building_id: selectedBuilding }),
        });
        const data = await res.json();
        
        if (data.success) {
          const summary = data.summary;
          setResult({
            success: true,
            message: `${summary?.invited_count || 0} Mieter eingeladen, ${summary?.skipped_count || 0} übersprungen`,
          });
        } else {
          setResult({
            success: false,
            message: data.error || "Fehler beim Einladen",
          });
        }
      } else {
        // Single invite
        const tenant = tenants.find(t => t.contractor_id === selectedTenant);
        if (!tenant || !tenant.email) {
          setResult({
            success: false,
            message: "Kein Mieter ausgewählt oder keine E-Mail vorhanden",
          });
          return;
        }

        const res = await fetch("/api/tenant/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            contractor_id: selectedTenant, 
            email: tenant.email,
          }),
        });
        const data = await res.json();
        
        if (data.success) {
          setResult({
            success: true,
            message: `Einladung an ${tenant.email} gesendet`,
          });
        } else {
          setResult({
            success: false,
            message: data.error || "Fehler beim Einladen",
          });
        }
      }
    } catch (error) {
      console.error("Invite error:", error);
      setResult({
        success: false,
        message: "Netzwerkfehler beim Einladen",
      });
    } finally {
      setInviting(false);
    }
  };

  // Handle toggle (enable/disable)
  const handleToggle = async () => {
    if (!selectedTenantObj || !selectedTenantObj.tenant_login_id) return;
    
    setToggling(true);
    setResult(null);
    
    // Determine new enabled state based on current status
    // "active" or "invited" → disable (enabled = false)
    // "disabled" → enable (enabled = true)
    const currentlyEnabled = selectedTenantObj.status === "active" || selectedTenantObj.status === "invited";
    const newEnabled = !currentlyEnabled;
    const newStatus = newEnabled ? "active" : "disabled";
    
    // Get action text based on current status
    let action: string;
    if (selectedTenantObj.status === "invited") {
      action = "Einladung widerrufen";
    } else if (selectedTenantObj.status === "active") {
      action = "deaktiviert";
    } else {
      action = "aktiviert";
    }
    
    try {
      const res = await fetch(`/api/tenant/toggle/${selectedTenantObj.tenant_login_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newEnabled }),
      });
      const data = await res.json();
      
      if (data.success) {
        // Update local state to show change
        setTenants(prev => prev.map(t => 
          t.contractor_id === selectedTenant 
            ? { ...t, status: newStatus as Tenant["status"] }
            : t
        ));
        
        setResult({
          success: true,
          message: `${selectedTenantObj.first_name} ${selectedTenantObj.last_name}: ${action}`,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Fehler beim Ändern des Status",
        });
      }
    } catch (error) {
      console.error("Toggle error:", error);
      setResult({
        success: false,
        message: "Netzwerkfehler beim Ändern des Status",
      });
    } finally {
      setToggling(false);
    }
  };

  // Get selected tenant object
  const selectedTenantObj = tenants.find(t => t.contractor_id === selectedTenant);

  // Check tenant status
  const isActiveTenant = selectedTenantObj?.status === "active";
  const isInvitedTenant = selectedTenantObj?.status === "invited";
  const isDisabledTenant = selectedTenantObj?.status === "disabled";
  const hasLoginRecord = selectedTenantObj?.tenant_login_id != null;

  // Check if invite button should be enabled (only for not_invited tenants)
  const canInvite = selectedBuilding && 
    (inviteAll || (selectedTenant && selectedTenantObj?.status === "not_invited")) && 
    !inviting && !toggling;

  // Check if toggle button should be shown (for invited, active, or disabled tenants with login record)
  const showToggle = selectedTenantObj && hasLoginRecord && (isActiveTenant || isInvitedTenant || isDisabledTenant) && !inviteAll;

  // Count invitable tenants for bulk invite
  const invitableTenants = tenants.filter(t => t.email && t.status !== "active");

  // Get button text based on tenant status
  const getButtonText = (): string => {
    if (inviting) return "Wird gesendet...";
    if (inviteAll) return `Alle einladen (${invitableTenants.length})`;
    if (!selectedTenantObj) return "Einladen";
    
    switch (selectedTenantObj.status) {
      case "invited":
        return "Erneut einladen";
      case "disabled":
        return "Erneut einladen";
      default:
        return "Einladen";
    }
  };

  // Format date for German display
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get status info text
  const getStatusInfo = (): { text: string; color: string } | null => {
    if (!selectedTenantObj || inviteAll) return null;
    
    switch (selectedTenantObj.status) {
      case "active":
        return {
          text: `Aktiv seit ${selectedTenantObj.last_login_at ? formatDate(selectedTenantObj.last_login_at) : 'unbekannt'}`,
          color: "text-green-600"
        };
      case "invited":
        return {
          text: `Eingeladen am ${selectedTenantObj.invite_sent_at ? formatDate(selectedTenantObj.invite_sent_at) : 'unbekannt'} (ausstehend)`,
          color: "text-yellow-600"
        };
      case "disabled":
        return {
          text: "Zugang deaktiviert",
          color: "text-red-600"
        };
      default:
        return {
          text: "Noch nicht eingeladen",
          color: "text-gray-500"
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-4 p-4 bg-green/10 rounded-lg border border-green/20">
      <p className="text-sm font-medium text-dark_text">
        Mieter-Zugang einrichten
      </p>

      <BuildingSelector
        buildings={buildings}
        value={selectedBuilding}
        onChange={handleBuildingChange}
        loading={loadingBuildings}
      />

      <TenantSelector
        tenants={tenants}
        value={selectedTenant}
        onChange={handleTenantChange}
        disabled={!selectedBuilding || inviteAll}
        loading={loadingTenants}
      />

      {/* Status info */}
      {statusInfo && (
        <div className={`text-sm ${statusInfo.color} bg-white/50 p-2 rounded`}>
          Status: {statusInfo.text}
        </div>
      )}

      {/* Bulk invite checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="invite-all-tenants"
          checked={inviteAll}
          onChange={(e) => handleInviteAllChange(e.target.checked)}
          disabled={!selectedBuilding || invitableTenants.length === 0}
          className="rounded border-gray-300"
        />
        <label 
          htmlFor="invite-all-tenants" 
          className={`text-sm ${!selectedBuilding || invitableTenants.length === 0 ? 'text-gray-400' : 'text-dark_text'}`}
        >
          Alle Mieter für dieses Gebäude einladen
          {selectedBuilding && invitableTenants.length > 0 && (
            <span className="text-gray-500"> ({invitableTenants.length} Mieter)</span>
          )}
        </label>
      </div>

      {/* Action buttons */}
      {showToggle ? (
        // Show toggle button for invited/active/disabled tenants
        <div className="space-y-2">
          <Button
            onClick={handleToggle}
            disabled={toggling}
            className={`w-full ${
              isDisabledTenant 
                ? "!bg-blue-500 hover:!bg-blue-600" 
                : isInvitedTenant 
                  ? "!bg-orange-500 hover:!bg-orange-600"
                  : "!bg-red-500 hover:!bg-red-600"
            }`}
          >
            {toggling ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Wird geändert...
              </span>
            ) : isDisabledTenant ? (
              "Aktivieren"
            ) : isInvitedTenant ? (
              "Einladung widerrufen"
            ) : (
              "Deaktivieren"
            )}
          </Button>
          {isDisabledTenant && (
            <Button
              onClick={handleInvite}
              disabled={inviting || toggling}
              className="w-full"
            >
              {inviting ? "Wird gesendet..." : "Erneut einladen"}
            </Button>
          )}
        </div>
      ) : (
        // Show invite button for not_invited tenants
        <Button
          onClick={handleInvite}
          disabled={!canInvite}
          className="w-full"
        >
          {inviting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Wird gesendet...
            </span>
          ) : (
            getButtonText()
          )}
        </Button>
      )}

      {/* Result message */}
      {result && (
        <div className={`text-sm p-2 rounded ${
          result.success 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {result.success ? '✓' : '✗'} {result.message}
        </div>
      )}

    </div>
  );
}

export default TenantInviteSection;
