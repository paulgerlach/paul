import { cn } from "@/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-[#757575]/50 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
