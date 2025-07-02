import * as React from "react";

import { cn } from "@/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex min-h-14 w-full bg-white px-3.5 py-4 border border-black/20 rounded-md text-base max-xl:text-sm max-xl:min-h-10 max-xl:py-2 ring-offset-background file:text-sm file:font-medium file:text-foreground placeholder:text-dark_text/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/40 focus-visible:border-green transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 max-medium:text-sm",
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
