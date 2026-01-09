import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import QueryProvider from "../QueryProvider";
import { Toaster } from "@/components/Basic/ui/Sonner";
import { Suspense, lazy } from "react";

// Lazy-load the dialogs
const LazyLoginDialog = lazy(() => import("@/components/Basic/Dialog/LoginDialog"));
const LazyRegisterDialog = lazy(() => import("@/components/Basic/Dialog/RegisterDialog"));
const LazyForgotPasswordDialog = lazy(() => import("@/components/Basic/Dialog/ForgotPasswordDialog"));

export const metadata: Metadata = {
  title: "Heidi Systems",
  description:
    "Digitale Erfassung aller Verbrauchsdaten im Gebäude Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.",
};

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
      <Toaster />
    </QueryProvider>
  );
}
