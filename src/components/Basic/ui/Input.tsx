import * as React from "react";

import { cn } from "@/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-black/20 bg-white p-3 text-base ring-offset-background file:text-sm file:font-medium file:text-foreground placeholder:text-dark_text/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/40 focus-visible:border-green transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
