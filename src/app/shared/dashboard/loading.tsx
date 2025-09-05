import ChartCardSkeleton from "@/components/Basic/ui/ChartCardSkeleton";

export default function Loading() {
  return (
    <div className="py-6 px-9 overflow-scroll">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className='max-w-[1440px] max-2xl:max-w-[1200px] max-xl:max-w-5xl rounded-2xl px-4 border-y-[16px] border-[#EFEEEC] bg-[#EFEEEC] w-full overflow-y-auto grid grid-rows-1 mt-6 max-xl:mt-4 mx-auto pb-2'>
        <div className='grid gap-3 grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 h-full'>
          <div className="flex flex-col gap-3">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </div>
          <div className="flex flex-col gap-3">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </div>
          <div className="flex flex-col gap-3">
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
