import { supabaseServer } from "../supabase/server";

export async function getAuthenticatedServerUser() {
    const supabase = await supabaseServer();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error("Unauthorized");
    }
    return user;
}