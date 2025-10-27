import type { Metadata } from "next";
import "../(admin)/globals.css";
import QueryProvider from "../QueryProvider";

export const metadata: Metadata = {
  title: "Shared Dashboard - Heidi Systems",
  description: "Shared dashboard view for Heidi Systems utility monitoring",
};

export default function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Provide a separate QueryProvider instance to isolate the shared dashboard's queries
  // from the admin dashboard's cached data
  return <QueryProvider>{children}</QueryProvider>;
}

