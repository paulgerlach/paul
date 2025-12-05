import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "../QueryProvider";
import AdminHeader from "@/components/Header/AdminHeader/AdminHeader";
import Sidebar from "@/components/Admin/Sidebar/Sidebar";
import MobileSidebar from "@/components/Admin/Sidebar/MobileSidebar";
import ObjekteDeleteDialog from "@/components/Basic/Dialog/ObjekteDeleteDialog";
import LocalDeleteDialog from "@/components/Basic/Dialog/LocalDeleteDialog";
import ContractDeleteDialog from "@/components/Basic/Dialog/ContractDeleteDialog";
import DocumentDeleteDialog from "@/components/Basic/Dialog/DocumentDeleteDialog";
import { Toaster } from "@/components/Basic/ui/Sonner";
import HeatingBillCreateDialog from "@/components/Basic/Dialog/HeatingBillCreateDialog";
import AddDocHeizkostenabrechnungDialog from "@/components/Basic/Dialog/AddDocHeizkostenabrechnungDialog";
import AddDocBetriebskostenabrechnungDialog from "@/components/Basic/Dialog/AddDocBetriebskostenabrechnungDialog";
import AddHeizkostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/AddHeizkostenabrechnungCostTypeDialog";
import AddBetriebskostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/AddBetriebskostenabrechnungCostTypeDialog";
import EditBetriebskostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/EditBetriebskostenabrechnungCostTypeDialog";
import EditHeizkostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/EditHeizkostenabrechnungCostTypeDialog";
import CostTypeHeizkostenabrechnungDeleteDialog from "@/components/Basic/Dialog/CostTypeHeizkostenabrechnungDeleteDialog";
import CostTypeBetriebskostenabrechnungDeleteDialog from "@/components/Basic/Dialog/CostTypeBetriebskostenabrechnungDeleteDialog";
import OperatingCostDocumentDeleteDialog from "@/components/Basic/Dialog/OperatingCostDocumentDeleteDialog";
import AdminAddBetriebskostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/Admin/AdminAddBetriebskostenabrechnungCostTypeDialog";
import AdminEditBetriebskostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/Admin/AdminEditBetriebskostenabrechnungCostTypeDialog";
import AdminAddDocBetriebskostenabrechnungDialog from "@/components/Basic/Dialog/Admin/AdminAddDocBetriebskostenabrechnungDialog";
import AdminHeatingBillCreateDialog from "@/components/Basic/Dialog/Admin/AdminHeatingBillCreateDialog";
import AdminOperatingCostDocumentDeleteDialog from "@/components/Basic/Dialog/Admin/AdminOperatingCostDocumentDeleteDialog";
import AdminContractDeleteDialog from "@/components/Basic/Dialog/Admin/AdminContractDeleteDialog";
import AdminLocalDeleteDialog from "@/components/Basic/Dialog/Admin/AdminLocalDeleteDialog";
import AdminObjekteDeleteDialog from "@/components/Basic/Dialog/Admin/AdminObjekteDeleteDialog";
import AdminEditHeizkostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/Admin/AdminEditHeizkostenabrechnungCostTypeDialog";
import AdminAddHeizkostenabrechnungCostTypeDialog from "@/components/Basic/Dialog/Admin/AdminAddHeizkostenabrechnungCostTypeDialog";
import ShareDashboardDialog from "@/components/Basic/Dialog/ShareDashboardDialog";

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
      <div className="h-screen flex flex-col bg-base-bg overflow-hidden max-medium:overflow-y-auto">
        <AdminHeader />
        <div className="grid grid-cols-[auto_1fr] max-large:grid-cols-1 gap-0 flex-1 overflow-hidden max-medium:overflow-visible w-full bg-base-bg">
          <Sidebar />
          <MobileSidebar />
          {children}
        </div>
      </div>
      <ObjekteDeleteDialog />
      <AdminObjekteDeleteDialog />
      <LocalDeleteDialog />
      <AdminLocalDeleteDialog />
      <ContractDeleteDialog />
      <AdminContractDeleteDialog />
      <HeatingBillCreateDialog />
      <AdminHeatingBillCreateDialog />
      <AddDocHeizkostenabrechnungDialog />
      <AddHeizkostenabrechnungCostTypeDialog />
      <AdminAddHeizkostenabrechnungCostTypeDialog />
      <AddDocBetriebskostenabrechnungDialog />
      <AddBetriebskostenabrechnungCostTypeDialog />
      <AdminAddBetriebskostenabrechnungCostTypeDialog />
      <EditBetriebskostenabrechnungCostTypeDialog />
      <AdminEditBetriebskostenabrechnungCostTypeDialog />
      <EditHeizkostenabrechnungCostTypeDialog />
      <AdminEditHeizkostenabrechnungCostTypeDialog />
      <CostTypeHeizkostenabrechnungDeleteDialog />
      <CostTypeBetriebskostenabrechnungDeleteDialog />
      <OperatingCostDocumentDeleteDialog />
      <AdminOperatingCostDocumentDeleteDialog />
      <DocumentDeleteDialog />
      <AdminAddDocBetriebskostenabrechnungDialog />
      <ShareDashboardDialog />
      <Toaster />
    </QueryProvider>
  );
}
