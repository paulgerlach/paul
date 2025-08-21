"use client";

import { usePathname } from "next/navigation";

/**
 * Client-only helper to generate a path to a sub-route
 */
export function useSubRouteLink(subRoute: string) {
    const pathname = usePathname();

    const newPath = `${pathname.replace(/\/$/, "")}/${subRoute.replace(/^\//, "")}`;

    return newPath;
}
