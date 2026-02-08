"use server";

import { supabaseServer } from "@/utils/supabase/server";
import { isSuperAdmin } from "@/auth";
import { getAuthenticatedServerUser } from "@/utils/auth/server";

/**
 * Get the current registration enabled status
 * Public function - anyone can check if registration is enabled
 */
export async function getRegistrationStatus(): Promise<{
  enabled: boolean;
  error?: string;
}> {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("system_settings")
      .select("registration_enabled")
      .single();

    if (error) {
      console.error("Error fetching registration status:", error);
      return { enabled: true, error: error.message }; // Default to enabled on error
    }

    return { enabled: data?.registration_enabled ?? true };
  } catch (err) {
    console.error("Unexpected error fetching registration status:", err);
    return { enabled: true, error: "Failed to fetch registration status" };
  }
}

/**
 * Update the registration enabled status
 * Admin-only function
 */
export async function updateRegistrationStatus(
  enabled: boolean
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const user = await getAuthenticatedServerUser();
    const isSuperAdminUser = await isSuperAdmin(user.id);

    if (!isSuperAdminUser) {
      return {
        success: false,
        error: "Only administrators can change registration settings",
      };
    }

    const supabase = await supabaseServer();

    // Get the single row (there should only be one)
    const { data: existingRow } = await supabase
      .from("system_settings")
      .select("id")
      .single();

    if (!existingRow) {
      return {
        success: false,
        error: "System settings not initialized",
      };
    }

    // Update the row
    const { error } = await supabase
      .from("system_settings")
      .update({
        registration_enabled: enabled,
      })
      .eq("id", existingRow.id);

    if (error) {
      console.error("Error updating registration status:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error updating registration status:", err);
    return {
      success: false,
      error: "Failed to update registration status",
    };
  }
}

