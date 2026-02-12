import type { Metadata } from "next";
import "../(admin)/globals.css";
import QueryProvider from "../QueryProvider";

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
