import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "../QueryProvider";
import FragebogenHeader from "@/components/Header/FragebogenHeader";
import ChatBotContainer from "@/components/Common/ChatBot";

export const metadata: Metadata = {
  title: "Heidi Systems",
  description:
    "Digitale Erfassung aller Verbrauchsdaten im Gebäude Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.",
};

export default function FragebogenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <FragebogenHeader />
      {children}
      <ChatBotContainer />
      
    </QueryProvider>
  );
}
