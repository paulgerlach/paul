import { supabase } from "./supabase/client";

export async function getAuthenticatedUser() {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("Unauthorized");
    }
    return user;
}