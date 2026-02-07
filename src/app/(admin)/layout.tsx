import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "../QueryProvider";
import AdminHeader from "@/components/Header/AdminHeader/AdminHeader";
import Sidebar from "@/components/Admin/Sidebar/Sidebar";
import MobileSidebar from "@/components/Admin/Sidebar/MobileSidebar";
import { Toaster } from "@/components/Basic/ui/Sonner";
import { Suspense, lazy } from "react";
import Loading from "@/components/Basic/Loading/Loading";
import ChatBotContainer from "@/components/Common/ChatBot";
import { supabaseServer } from "@/utils/supabase/server";


// Lazy-load all dialogs
const LazyObjekteDeleteDialog = lazy(
  () => import("@/components/Basic/Dialog/ObjekteDeleteDialog")
);
const LazyAdminObjekteDeleteDialog = lazy(
  () => import("@/components/Basic/Dialog/Admin/AdminObjekteDeleteDialog")
);
const LazyLocalDeleteDialog = lazy(
  () => import("@/components/Basic/Dialog/LocalDeleteDialog")
);
const LazyAdminLocalDeleteDialog = lazy(
  () => import("@/components/Basic/Dialog/Admin/AdminLocalDeleteDialog")
);
const LazyContractDeleteDialog = lazy(
  () => import("@/components/Basic/Dialog/ContractDeleteDialog")
);
const LazyAdminContractDeleteDialog = lazy(
  () => import("@/components/Basic/Dialog/Admin/AdminContractDeleteDialog")
);
const LazyHeatingBillCreateDialog = lazy(
  () => import("@/components/Basic/Dialog/HeatingBillCreateDialog")
);
const LazyAdminHeatingBillCreateDialog = lazy(
  () => import("@/components/Basic/Dialog/Admin/AdminHeatingBillCreateDialog")
);
const LazyAddDocHeizkostenabrechnungDialog = lazy(
  () => import("@/components/Basic/Dialog/AddDocHeizkostenabrechnungDialog")
);
const LazyAddHeizkostenabrechnungCostTypeDialog = lazy(
  () =>
    import("@/components/Basic/Dialog/AddHeizkostenabrechnungCostTypeDialog")
);
const LazyAdminAddHeizkostenabrechnungCostTypeDialog = lazy(
  () =>
    import(
      "@/components/Basic/Dialog/Admin/AdminAddHeizkostenabrechnungCostTypeDialog"
    )
);
const LazyAddDocBetriebskostenabrechnungDialog = lazy(
  () => import("@/components/Basic/Dialog/AddDocBetriebskostenabrechnungDialog")
);
const LazyAddBetriebskostenabrechnungCostTypeDialog = lazy(
  () =>
    import(
      "@/components/Basic/Dialog/AddBetriebskostenabrechnungCostTypeDialog"
    )
);
const LazyAdminAddBetriebskostenabrechnungCostTypeDialog = lazy(
  () =>
    import(
      "@/components/Basic/Dialog/Admin/AdminAddBetriebskostenabrechnungCostTypeDialog"
    )
);
const LazyEditBetriebskostenabrechnungCostTypeDialog = lazy(
  () =>
    import(
      "@/components/Basic/Dialog/EditBetriebskostenabrechnungCostTypeDialog"
    )
);
const LazyAdminEditBetriebskostenabrechnungCostTypeDialog = lazy(
  () =>
    import(
      "@/components/Basic/Dialog/Admin/AdminEditBetriebskostenabrechnungCostTypeDialog"
    )
);
const LazyEditHeizkostenabrechnungCostTypeDialog = lazy(
  () =>
    import("@/components/Basic/Dialog/EditHeizkostenabrechnungCostTypeDialog")
);
const LazyAdminEditHeizkostenabrechnungCostTypeDialog = lazy(
  () =>
    import(
      "@/components/Basic/Dialog/Admin/AdminEditHeizkostenabrechnungCostTypeDialog"
    )
);
const LazyCostTypeHeizkostenabrechnungDeleteDialog = lazy(
  () =>
    import("@/components/Basic/Dialog/CostTypeHeizkostenabrechnungDeleteDialog")
);
const LazyCostTypeBetriebskostenabrechnungDeleteDialog = lazy(
  () =>
    import(
      "@/components/Basic/Dialog/CostTypeBetriebskostenabrechnungDeleteDialog"
    )
);
const LazyOperatingCostDocumentDeleteDialog = lazy(
  () => import("@/components/Basic/Dialog/OperatingCostDocumentDeleteDialog")
);
const LazyAdminOperatingCostDocumentDeleteDialog = lazy(
  () =>
    import(
      "@/components/Basic/Dialog/Admin/AdminOperatingCostDocumentDeleteDialog"
    )
);
const LazyDocumentDeleteDialog = lazy(
  () => import("@/components/Basic/Dialog/DocumentDeleteDialog")
);
const LazyAdminAddDocBetriebskostenabrechnungDialog = lazy(
  () =>
    import(
      "@/components/Basic/Dialog/Admin/AdminAddDocBetriebskostenabrechnungDialog"
    )
);
const LazyShareDashboardDialog = lazy(
  () => import("@/components/Basic/Dialog/ShareDashboardDialog")
);
const LazyInviteUserDialog = lazy(
	() => import("@/components/Basic/Dialog/Admin/InviteUserDialog"),
);

export const metadata: Metadata = {
  title: "Heidi Systems",
  description:
    "Digitale Erfassung aller Verbrauchsdaten im Gebäude Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await supabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isExistingClient = !!session;
  const userId = session?.user.id; 

  return (
		<Suspense fallback={<Loading />}>
			<QueryProvider>
				<main className="h-screen flex flex-col bg-base-bg overflow-hidden max-medium:overflow-y-auto">
					<AdminHeader />
					<div className="grid grid-cols-[auto_1fr] max-large:grid-cols-1 gap-0 flex-1 overflow-hidden max-medium:overflow-visible w-full bg-base-bg">
						<Sidebar />
						<MobileSidebar />
						{children}
					</div>
				</main>
				<Suspense fallback={null}>
					<LazyObjekteDeleteDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAdminObjekteDeleteDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyLocalDeleteDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAdminLocalDeleteDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyContractDeleteDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAdminContractDeleteDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyHeatingBillCreateDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAdminHeatingBillCreateDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAddDocHeizkostenabrechnungDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAddHeizkostenabrechnungCostTypeDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAdminAddHeizkostenabrechnungCostTypeDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAddDocBetriebskostenabrechnungDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAddBetriebskostenabrechnungCostTypeDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAdminAddBetriebskostenabrechnungCostTypeDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyEditBetriebskostenabrechnungCostTypeDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAdminEditBetriebskostenabrechnungCostTypeDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyEditHeizkostenabrechnungCostTypeDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAdminEditHeizkostenabrechnungCostTypeDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyCostTypeHeizkostenabrechnungDeleteDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyCostTypeBetriebskostenabrechnungDeleteDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyOperatingCostDocumentDeleteDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAdminOperatingCostDocumentDeleteDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyDocumentDeleteDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyAdminAddDocBetriebskostenabrechnungDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyShareDashboardDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyShareDashboardDialog />
				</Suspense>
				<Suspense fallback={null}>
					<LazyInviteUserDialog />
				</Suspense>
				<Toaster />
				<ChatBotContainer isExistingClient={isExistingClient} userId={userId} />
			</QueryProvider>
		</Suspense>
	);
}
