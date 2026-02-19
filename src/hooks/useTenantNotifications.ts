"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { generateTenantNotifications, type NotificationItem } from "@/utils/tenantNotifications";
import type { ContractType, LocalType } from "@/types";

/**
 * Hook to fetch and generate tenant/apartment notifications
 * Returns notifications for new tenants and apartments created in the last 7 days
 */
export function useTenantNotifications(userId: string | undefined): {
    notifications: NotificationItem[];
    isLoading: boolean;
    error: Error | null;
} {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setNotifications([]);
            setIsLoading(false);
            return;
        }

        const fetchTenantNotifications = async () => {
            try {
                setIsLoading(true);

                // Calculate cutoff date (7 days ago)
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - 7);
                const cutoffISO = cutoffDate.toISOString();

                // Fetch recent contracts (created in last 7 days with is_current = true)
                const { data: contractsData, error: contractsError } = await supabase
                    .from('contracts')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('is_current', true)
                    .gte('created_at', cutoffISO);

                if (contractsError) {
                    throw new Error(`Failed to fetch contracts: ${contractsError.message}`);
                }

                // Fetch user's objekte first
                const { data: objekteData, error: objekteError } = await supabase
                    .from('objekte')
                    .select('id')
                    .eq('user_id', userId);

                if (objekteError) {
                    throw new Error(`Failed to fetch objekte: ${objekteError.message}`);
                }

                const objektIds = objekteData?.map((obj: any) => obj.id) || [];

                // Fetch recent locals (created in last 7 days)
                let localsData: LocalType[] = [];
                if (objektIds.length > 0) {
                    const { data, error: localsError } = await supabase
                        .from('locals')
                        .select('*')
                        .in('objekt_id', objektIds)
                        .gte('created_at', cutoffISO);

                    if (localsError) {
                        throw new Error(`Failed to fetch locals: ${localsError.message}`);
                    }

                    localsData = data || [];
                }

                // Generate notifications
                const tenantNotifications = generateTenantNotifications(
                    contractsData as ContractType[] || [],
                    localsData
                );

                setNotifications(tenantNotifications);
                setError(null);
            } catch (err) {
                console.error('Error fetching tenant notifications:', err);
                setError(err as Error);
                setNotifications([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTenantNotifications();
    }, [userId]);

    return { notifications, isLoading, error };
}
