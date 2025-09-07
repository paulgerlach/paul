import type { Metadata } from "next";
import "../(admin)/globals.css";

export const metadata: Metadata = {
  title: "Geteiltes Dashboard - Heidi Systems",
  description: "Geteilte Dashboard-Ansicht für Heidi Systems Verbrauchsüberwachung",
};

export default function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout simply wraps the children and ensures the admin styles are applied.
  return <>{children}</>;
}

