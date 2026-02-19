import { keys, green_check } from "@/static/icons";
import type { ContractType, LocalType } from "@/types";

export interface TenantNotification {
    type: "tenant_moved_in" | "apartment_added";
    date: Date;
    localId: string;
    tenantName?: string;
    apartmentLocation?: string;
}

export interface NotificationItem {
    leftIcon: any;
    rightIcon: any;
    leftBg: string;
    rightBg: string;
    title: string;
    subtitle: string;
    severity: "critical" | "high" | "medium" | "low";
    localId?: string;
    contractId?: string;
}

/**
 * Check if a date is within the last N days
 */
function isRecent(dateString: string | null | undefined, days: number): boolean {
    if (!dateString) return false;

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays <= days && diffDays >= 0;
}

/**
 * Generate notifications for tenant lifecycle events
 * @param recentContracts - Contracts created or updated in the last 7 days
 * @param recentLocals - Apartments created in the last 7 days
 */
export function generateTenantNotifications(
    recentContracts: ContractType[],
    recentLocals: LocalType[]
): NotificationItem[] {
    const notifications: NotificationItem[] = [];

    // Tenant moved in (new contract with is_current = true, created in last 7 days)
    recentContracts.forEach(contract => {
        if (contract.is_current && isRecent(contract.created_at, 7)) {
            notifications.push({
                leftIcon: keys, // House keys icon for new tenant
                rightIcon: green_check,
                leftBg: "#E7E8EA",
                rightBg: "#E7F2E8", // Green
                title: "Neuer Mieter eingezogen",
                subtitle: `Vertrag erstellt am ${new Date(contract.created_at).toLocaleDateString('de-DE')}`,
                severity: "low",
                contractId: contract.id,
                localId: contract.local_id
            });
        }
    });

    // Apartment added (new local created in last 7 days)
    recentLocals.forEach(local => {
        if (isRecent(local.created_at, 7)) {
            const location = [local.floor, local.house_location].filter(Boolean).join(", ");

            notifications.push({
                leftIcon: keys, // House keys icon for new apartment
                rightIcon: green_check,
                leftBg: "#E7E8EA",
                rightBg: "#E7F2E8", // Green
                title: "Neue Wohnung hinzugefügt",
                subtitle: location || `Wohnung ID: ${local.id}`,
                severity: "low",
                localId: local.id
            });
        }
    });

    return notifications;
}

/**
 * Get recent contracts (created in last N days with is_current = true)
 * This should be called from a component with database access
 */
export async function getRecentContracts(
    supabase: any,
    userId: string,
    days: number = 7
): Promise<ContractType[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_current', true)
        .gte('created_at', cutoffDate.toISOString());

    if (error) {
        console.error('Error fetching recent contracts:', error);
        return [];
    }

    return data || [];
}

/**
 * Get recent apartments (created in last N days)
 * This should be called from a component with database access
 */
export async function getRecentLocals(
    supabase: any,
    userId: string,
    days: number = 7
): Promise<LocalType[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Get all objekte for this user first
    const { data: objekteData, error: objekteError } = await supabase
        .from('objekte')
        .select('id')
        .eq('user_id', userId);

    if (objekteError || !objekteData) {
        console.error('Error fetching objekte:', objekteError);
        return [];
    }

    const objektIds = objekteData.map((obj: any) => obj.id);

    if (objektIds.length === 0) return [];

    // Get locals for these objekte
    const { data, error } = await supabase
        .from('locals')
        .select('*')
        .in('objekt_id', objektIds)
        .gte('created_at', cutoffDate.toISOString());

    if (error) {
        console.error('Error fetching recent locals:', error);
        return [];
    }

    return data || [];
}
