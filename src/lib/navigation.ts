import { headers } from "next/headers";

/**
 * Get the current pathname (works on server or client)
 */
export async function getCurrentPath(): Promise<string> {
    if (typeof window === "undefined") {
        const h = await headers();
        const path = h.get("x-url") ?? "/";
        const fullUrl = `${path}`;
        return new URL(fullUrl).pathname;
    } else {
        return window.location.pathname;
    }
}

export async function buildSubRoute(subRoute: string): Promise<string> {

    const currentPath = await getCurrentPath();
    return `${currentPath.replace(/\/$/, "")}/${subRoute.replace(/^\//, "")}`;
}

