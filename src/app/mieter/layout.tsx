import type { Metadata } from "next";
import QueryProvider from "../QueryProvider";
import "../globals.css";

export const metadata: Metadata = {
  title: "Mieter-Dashboard - Heidi Systems",
  description: "Verbrauchsdaten für Mieter - Heidi Systems",
};

export default function MieterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Provide a separate QueryProvider instance to isolate tenant queries
  // from the admin dashboard's cached data
  return <QueryProvider>{children}</QueryProvider>;
}
