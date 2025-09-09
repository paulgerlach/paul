"use client";

import { Button } from "@/components/Basic/ui/Button";
import { useDialogStore } from "@/store/useDIalogStore";

interface ShareButtonProps {
  className?: string;
}

export default function ShareButton({ className = "" }: ShareButtonProps) {
  const { openDialogByType, openDialog } = useDialogStore();
  const isOpen = openDialogByType.share_dashboard;
  return (
    <>
      <Button
        onClick={() => openDialog("share_dashboard")}
        disabled={isOpen}
        className={`inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-300 ${className}`}
      >
        Dashboard teilen
      </Button>
    </>
  );
}
