"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDialogStore } from "@/store/useDIalogStore";

/**
 * Component that detects ?tenant-login=true in URL and auto-opens the TenantLoginDialog.
 * Used when redirecting from /mieter/dashboard for unauthenticated tenants.
 */
export default function TenantLoginAutoOpen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openDialog } = useDialogStore();

  useEffect(() => {
    const shouldOpenLogin = searchParams.get("tenant-login") === "true";
    
    if (shouldOpenLogin) {
      // Open the tenant login dialog
      openDialog("tenantLogin");
      
      // Remove the query param from URL (clean URL)
      const url = new URL(window.location.href);
      url.searchParams.delete("tenant-login");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, openDialog, router]);

  return null; // This component doesn't render anything
}
