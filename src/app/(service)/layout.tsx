import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "../QueryProvider";
import FragebogenHeader from "@/components/Header/FragebogenHeader";
import ChatBotContainer from "@/components/Common/ChatBot";
import { supabaseServer } from "@/utils/supabase/server";
import { Suspense } from "react";
import Loading from "@/components/Basic/Loading/Loading";

export const metadata: Metadata = {
  title: "Heidi Systems",
  description:
    "Digitale Erfassung aller Verbrauchsdaten im Gebäude Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.",
};

export default async function FragebogenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isExistingClient = !!user;
  const userId = user?.id;

  return (
    <Suspense fallback={<Loading />}>
      <QueryProvider>
        <FragebogenHeader />
        {children}
        <ChatBotContainer
          isExistingClient={isExistingClient}
          userId={userId}
        />
      </QueryProvider>
    </Suspense>
  );
}
