"use client";

import { Button } from "@/components/Basic/ui/Button";
import { useDialogStore } from "@/store/useDIalogStore";
import type { DialogDocumentActionType } from "@/types";

export default function OpenItitalDocDialogButton({
  dialogName,
  buttonText,
}: {
  dialogName: DialogDocumentActionType;
  buttonText: string;
}) {
  const { openDialog } = useDialogStore();
  return <Button onClick={() => openDialog(dialogName)}>{buttonText}</Button>;
}
