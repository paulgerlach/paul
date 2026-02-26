"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { dots_button } from "@/static/icons";
import Link from "next/link";
import { useDialogStore } from "@/store/useDIalogStore";
import type { DialogDocumentActionType } from "@/types";
import { Pencil, Trash, Upload } from "lucide-react";

export type ThreeDotsButtonProps = {
  editLink?: string;
  itemID?: string;
  dialogAction?: DialogDocumentActionType;
  onUpload?: (file: File) => void;
  disabled?: boolean;
};

export default function ThreeDotsButton({
  editLink,
  dialogAction,
  itemID,
  onUpload,
  disabled
}: ThreeDotsButtonProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setItemID, openDialog } = useDialogStore();

  const handleOpenDialog = () => {
    if (dialogAction) {
      setItemID(itemID);
      openDialog(dialogAction);
    }
    setOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload?.(e.target.files[0]);
      setOpen(false);
    }
    // reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="size-4 border-none bg-transparent cursor-pointer flex items-center justify-center disabled:opacity-50"
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-4 max-h-4"
            src={dots_button}
            alt="dots button"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-40 p-2 flex flex-col bg-white border-none shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {editLink && (
          <Link
            href={editLink}
            onClick={() => setOpen(false)}
            className="text-xl max-xl:text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md"
          >
            <Pencil className="w-4 h-4 max-xl:w-3 max-xl:h-3" /> Bearbeiten
          </Link>
        )}
        {dialogAction && (
          <button
            onClick={() => handleOpenDialog()}
            className="text-xl max-xl:text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md"
          >
            <Trash className="w-4 h-4 max-xl:w-3 max-xl:h-3" /> Löschen
          </button>
        )}
        {onUpload && (
          <>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xl max-xl:text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md"
            >
              <Upload className="w-4 h-4 max-xl:w-3 max-xl:h-3" /> Hochladen
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
