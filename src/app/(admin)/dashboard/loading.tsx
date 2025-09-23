import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ChartCardSkeleton from "@/components/Basic/ui/ChartCardSkeleton";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";

export default function DashboardLoading() {
  return (
    <div className="py-6 px-9 overflow-scroll">
      <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="Dashboard" />
      <ContentWrapper className="grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        <div className="flex flex-col gap-3">
          <div className="h-[312px]"><ChartCardSkeleton /></div>
          <div className="h-[273px]"><ChartCardSkeleton /></div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-[265px]"><ChartCardSkeleton /></div>
          <div className="h-[320px]"><ChartCardSkeleton /></div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-[410px]"><ChartCardSkeleton /></div>
          <div className="h-[175px]"><ChartCardSkeleton /></div>
        </div>
      </ContentWrapper>
    </div>
  );
}
