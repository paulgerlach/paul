import type { Metadata } from "next";
import "../(admin)/globals.css";

export const metadata: Metadata = {
  title: "Shared Dashboard - Heidi Systems",
  description: "Shared dashboard view for Heidi Systems utility monitoring",
};

export default function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout simply wraps the children and ensures the admin styles are applied.
  return <>{children}</>;
}

