import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ChartCardSkeleton from "@/components/Basic/ui/ChartCardSkeleton";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";

function ChartCardSkeletonLocal() {
  return <ChartCardSkeleton />;
}
export default function DashboardLoading() {
  return (
    <div className="py-6 px-9 overflow-scroll">
      <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
      <ContentWrapper className="grid gap-3 grid-cols-3 max-large:grid-cols-2 max-medium:grid-cols-1">
        <div className="flex flex-col gap-3">
          <div className="h-[312px]"><ChartCardSkeletonLocal /></div>
          <div className="h-[273px]"><ChartCardSkeletonLocal /></div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-[265px]"><ChartCardSkeletonLocal /></div>
          <div className="h-[320px]"><ChartCardSkeletonLocal /></div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-[410px]"><ChartCardSkeletonLocal /></div>
          <div className="h-[175px]"><ChartCardSkeletonLocal /></div>
        </div>
      </ContentWrapper>
    </div>
  );
}
