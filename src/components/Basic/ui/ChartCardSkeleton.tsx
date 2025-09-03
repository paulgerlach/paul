import { Skeleton } from "@/components/Basic/ui/Skeleton";

export default function ChartCardSkeleton() {
  return (
    <div className="w-full h-full p-3 flex flex-col gap-3">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-full w-full rounded-xl" />
    </div>
  );
}


