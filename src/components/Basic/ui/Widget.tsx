import type { ReactNode } from "react";
import { ErrorState } from "@/components/Basic/ui/States";

export default function Widget({
  heightClass,
  showError,
  errorMessage,
  showEmpty,
  emptyMessage,
  children,
}: {
  heightClass: string;
  showError: boolean;
  errorMessage: string;
  showEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}) {
  return (
    <div className={`${heightClass} relative`}>
      {showError ? <ErrorState message={errorMessage} /> : children}
      {showEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center px-3 py-1 rounded-md bg-white/70 text-[#6B7280]">
            {emptyMessage}
          </div>
        </div>
      )}
    </div>
  );
}


