"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/Basic/ui/Dialog";
import { ReactNode } from "react";

interface MenuModalProps {
  title: string;
  children?: ReactNode;
  trigger: ReactNode;
}

export default function MenuModal({ title, children, trigger }: MenuModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className="
          w-[480px]
          max-w-[90vw]
          p-6
          bg-white
          rounded-xl
          border border-gray-100
          shadow-[0_10px_30px_rgba(0,0,0,0.08)]
        "
      >
        <DialogTitle className="text-base font-medium text-gray-900">
          {title}
        </DialogTitle>

        <div className="mt-4 text-sm text-gray-600 leading-relaxed">
          {children || <p>Content here</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
