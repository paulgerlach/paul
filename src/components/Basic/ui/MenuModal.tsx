"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/Basic/ui/Dialog";
import { cn } from "@/utils";
import React, { ReactNode, useState } from "react";

interface MenuModalProps {
  title: string;
  children: (onClose: () => void, isOpen: boolean) => ReactNode;
  trigger: ReactNode;
  contentClassName?: string;
}

export default function MenuModal({ title, children, trigger, contentClassName }: MenuModalProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className={cn(
          "w-[620px] max-w-[90vw] p-6 bg-white rounded-xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
          contentClassName
        )}
        overlayClassName={contentClassName}
      >
        <DialogTitle className="text-base font-medium text-gray-900">
          {title}
        </DialogTitle>

        <div className="mt-4 text-sm text-gray-600 leading-relaxed">
          {children(() => setOpen(false), open)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
