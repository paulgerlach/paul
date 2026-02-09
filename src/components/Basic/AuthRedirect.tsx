"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { ROUTE_DASHBOARD } from "@/routes/routes";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error checking session:", error);
          return;
        }

        if (user) {
          // User is authenticated, get their permission level
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("permission")
            .eq("id", user.id)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
            return;
          }

          // Redirect based on user permission
          if (userData?.permission === "admin") {
            router.push("/admin");
          } else {
            router.push(ROUTE_DASHBOARD);
          }
        }
      } catch (error) {
        console.error("Unexpected error in auth check:", error);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  // This component doesn't render anything
  return null;
}
