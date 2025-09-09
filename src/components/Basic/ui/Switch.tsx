"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-green data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/90 inline-flex h-[1.15rem] w-9 shrink-0 items-center rounded-full border border-transparent inset-shadow-sm transition-all outline-none focus-visible:ring-[3px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shadow-xs shadow-black/5 bg-black/5",
        className
      )}
      {...props}>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white dark:data-[state=unchecked]:bg-dark_green/50 dark:data-[state=checked]:bg-primary-dark_green pointer-events-none block size-3.5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%+4px)] data-[state=unchecked]:translate-x-[2px]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
