import type { ReactNode } from "react";
import { EmptyState, ErrorState } from "@/components/Basic/ui/States";

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
    <div className={heightClass}>
      {showError ? (
        <ErrorState message={errorMessage} />
      ) : showEmpty ? (
        <EmptyState message={emptyMessage} />
      ) : (
        children
      )}
    </div>
  );
}


