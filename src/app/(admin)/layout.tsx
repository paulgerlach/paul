import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "../QueryProvider";
import AdminHeader from "@/components/Header/AdminHeader/AdminHeader";
import Sidebar from "@/components/Admin/Sidebar/Sidebar";
import ObjekteDeleteDialog from "@/components/Basic/Dialog/ObjekteDeleteDialog";
import LocalDeleteDialog from "@/components/Basic/Dialog/LocalDeleteDialog";
import ContractDeleteDialog from "@/components/Basic/Dialog/ContractDeleteDialog";
import { Toaster } from "@/components/Basic/ui/Sonner";
import OperatingCostsCreateDialog from "@/components/Basic/Dialog/OperatingCostsCreateDialog";
import AddDocHeizkostenabrechnungDialog from "@/components/Basic/Dialog/AddDocHeizkostenabrechnungDialog";
import AddDocBetriebskostenabrechnungDialog from "@/components/Basic/Dialog/AddDocBetriebskostenabrechnungDialog";
import AddHeizkostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/AddHeizkostenabrechnungCostTypeDialog";
import AddBetriebskostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/AddBetriebskostenabrechnungCostTypeDialog";
import EditBetriebskostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/EditBetriebskostenabrechnungCostTypeDialog copy";
import EditHeizkostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/EditHeizkostenabrechnungCostTypeDialog";
import CostTypeHeizkostenabrechnungDeleteDialog from "@/components/Basic/Dialog/CostTypeHeizkostenabrechnungDeleteDialog";
import CostTypeBetriebskostenabrechnungDeleteDialog from "@/components/Basic/Dialog/CostTypeBetriebskostenabrechnungDeleteDialog";
import OperatingCostDocumentDeleteDialog from "@/components/Basic/Dialog/OperatingCostDocumentDeleteDialog";

export const metadata: Metadata = {
  title: "Heidi Systems",
  description:
    "Digitale Erfassung aller Verbrauchsdaten im Gebäude Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <div className="h-screen grid grid-rows-[auto_1fr] bg-base-bg">
        <AdminHeader />
        <div className="grid grid-cols-[auto_1fr] gap-0 h-[calc(100dvh-61px)] overflow-hidden w-full bg-base-bg">
          <Sidebar />
          {children}
        </div>
      </div>
      <ObjekteDeleteDialog />
      <LocalDeleteDialog />
      <ContractDeleteDialog />
      <OperatingCostsCreateDialog />
      <AddDocHeizkostenabrechnungDialog />
      <AddHeizkostenabrechnungCostTypeDialog />
      <AddDocBetriebskostenabrechnungDialog />
      <AddBetriebskostenabrechnungCostTypeDialog />
      <EditBetriebskostenabrechnungCostTypeDialog />
      <EditHeizkostenabrechnungCostTypeDialog />
      <CostTypeHeizkostenabrechnungDeleteDialog />
      <CostTypeBetriebskostenabrechnungDeleteDialog />
      <OperatingCostDocumentDeleteDialog />
      <Toaster />
    </QueryProvider>
  );
}
