import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import QueryProvider from "../QueryProvider";
import LoginDialog from "@/components/Basic/LoginDialog/LoginDialog";
import RegisterDialog from "@/components/Basic/RegisterDialog/RegisterDialog";
import { Toaster } from "@/components/Basic/ui/Sonner";

const exo_2Sans = Exo_2({
  variable: "--font-exo_2-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heidi Systems",
  description:
    "Digitale Erfassung aller Verbrauchsdaten im Gebäude Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${exo_2Sans.variable}`}>
        <QueryProvider>
          <Header />
          {children}
          <Footer />
          <LoginDialog />
          <RegisterDialog />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
