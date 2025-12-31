import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import QueryProvider from "../QueryProvider";
import { Toaster } from "@/components/Basic/ui/Sonner";
import { Suspense, lazy } from "react";

// Lazy-load the dialogs
const LazyLoginDialog = lazy(() => import("@/components/Basic/Dialog/LoginDialog"));
const LazyRegisterDialog = lazy(() => import("@/components/Basic/Dialog/RegisterDialog"));
const LazyForgotPasswordDialog = lazy(() => import("@/components/Basic/Dialog/ForgotPasswordDialog"));

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
          {/* Wrap each in Suspense with a fallback (e.g., loading spinner or nothing) */}
          <Suspense fallback={null}>
            <LazyLoginDialog />
          </Suspense>
          <Suspense fallback={null}>
            <LazyRegisterDialog />
          </Suspense>
          <Suspense fallback={null}>
            <LazyForgotPasswordDialog />
          </Suspense>
          <Toaster />{" "}
          {/* Toaster might not need lazy loading if it's lightweight */}
        </QueryProvider>
      </body>
    </html>
  );
}
