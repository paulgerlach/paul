"use client";

import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { dots_button } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";
import type { DialogDocumentActionType } from "@/types";
import { Pencil, Trash } from "lucide-react";

export type TheeDotsCostTypeButtonProps = {
  editDialogAction: DialogDocumentActionType;
  deleteDialogAction: DialogDocumentActionType;
  itemID: string;
  userID?: string | null;
};

export default function TheeDotsCostTypeButton({
  editDialogAction, deleteDialogAction, itemID, userID
}: TheeDotsCostTypeButtonProps) {
  const { openDialog, setItemID } = useDialogStore();
  const handleOpenEditDialog = () => {
    setItemID(itemID);
    openDialog(editDialogAction);
  };
  const handleOpenDeleteDialog = () => {
    setItemID(itemID);
    openDialog(deleteDialogAction);
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
        <button onClick={() => handleOpenEditDialog()}
          className="text-xl max-xl:text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md">
          <Pencil className="w-4 h-4 max-xl:w-3 max-xl:h-3" /> Bearbeiten
        </button>
        {!!userID && (
          <button
            disabled={userID === null}
            onClick={() => handleOpenDeleteDialog()}
            className="text-xl max-xl:text-sm text-dark_green cursor-pointer flex items-center justify-start gap-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-green/20 transition-all duration-300 px-1.5 py-1 rounded-md">
            <Trash className="w-4 h-4 max-xl:w-3 max-xl:h-3" /> Löschen
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
