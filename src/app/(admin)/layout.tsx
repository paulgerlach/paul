import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import QueryProvider from "../QueryProvider";
import AdminHeader from "@/components/Header/AdminHeader/AdminHeader";
import Sidebar from "@/components/Admin/Sidebar/Sidebar";

const exo_2Sans = Exo_2({
  variable: "--font-exo_2-sans",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body className={`${exo_2Sans.variable}`}>
        <QueryProvider>
          <div className="h-screen grid grid-rows-[auto_1fr] bg-base-bg">
            <AdminHeader />
            <div className="grid grid-cols-[auto_1fr] gap-0 h-[calc(100dvh-81px)] w-full bg-base-bg">
              <Sidebar />
              {children}
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
