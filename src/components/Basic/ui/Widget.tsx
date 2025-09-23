import type { ReactNode } from "react";
import { EmptyState, ErrorState } from "@/components/Basic/ui/States";

export default function Widget({
  heightClass,
  showError,
  errorMessage,
  showEmpty,
  emptyTitle,
  emptyDescription,
  emptyImageSrc,
  emptyImageAlt,
  children,
}: {
  heightClass: string;
  showError: boolean;
  errorMessage: string;
  showEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  emptyImageSrc: string;
  emptyImageAlt: string;
  children: ReactNode;
}) {
  return (
    <div className={heightClass}>
      {showError ? (
        <ErrorState message={errorMessage} />
      ) : showEmpty ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          imageSrc={emptyImageSrc}
          imageAlt={emptyImageAlt}
        />
      ) : (
        children
      )}
    </div>
  );
}
