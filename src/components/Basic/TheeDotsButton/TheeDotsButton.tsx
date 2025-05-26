"use client";

import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { dots_button } from "@/static/icons";
import Link from "next/link";
import {
  type DialogDocumentActonType,
  useDeleteDialogStore,
} from "@/store/useDeleteDIalogStore";

export type ThreeDotsButtonProps = {
  editLink: string;
  detailsLink: string;
  itemID: string;
  dialogAction: DialogDocumentActonType;
};

export default function ThreeDotsButton({
  editLink,
  detailsLink,
  dialogAction,
  itemID,
}: ThreeDotsButtonProps) {
  const { setItemID, openDialog } = useDeleteDialogStore();
  const handleOpenDialog = () => {
    setItemID(itemID);
    openDialog(dialogAction);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="size-4 border-none bg-transparent cursor-pointer flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}>
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
        onClick={(e) => e.stopPropagation()}>
        <Link
          href={detailsLink}
          className="text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md">
          🔍 Details
        </Link>
        <Link
          href={editLink}
          className="text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md">
          ✏️ Bearbeiten
        </Link>
        <button
          onClick={() => handleOpenDialog()}
          className="text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md">
          🗑️ Löschen
        </button>
      </PopoverContent>
    </Popover>
  );
}
