import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import QueryProvider from "../QueryProvider";
import LoginDialog from "@/components/Basic/Dialog/LoginDialog";
import RegisterDialog from "@/components/Basic/Dialog/RegisterDialog";
import ForgotPasswordDialog from "@/components/Basic/Dialog/ForgotPasswordDialog";
import { Toaster } from "@/components/Basic/ui/Sonner";
import ChatBotContainer from "@/components/Common/ChatBot";

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
    <html lang="de">
      <body className={`${exo_2Sans.variable}`}>
        <QueryProvider>
          <Header />
          {children}
          <Footer />
          <LoginDialog />
          <RegisterDialog />
          <ForgotPasswordDialog />
          <Toaster />
          <ChatBotContainer isExistingClient={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
