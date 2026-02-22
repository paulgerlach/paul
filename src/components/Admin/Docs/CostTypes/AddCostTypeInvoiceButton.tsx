import { ai_starts } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";
import type { DialogStoreActionType } from "@/types";
import Image from "next/image";

export default function AddCostTypeInvoiceButton({
  dialogType,
}: {
  dialogType: DialogStoreActionType;
}) {
  const { openDialog } = useDialogStore();
  return (
    <button
      onClick={() => openDialog(dialogType)}
      className="border-dashed w-full cursor-pointer flex py-5 px-16 max-xl:px-10 items-center justify-center text-base text-[#6083CC] font-semibold border-2 border-[#6083CC] gap-5 rounded max-xl:text-sm"
    >
      <Image
        width={0}
        height={0}
        sizes="100vw"
        loading="lazy"
        className="max-w-8 max-h-8 max-xl:max-w-6 max-xl:max-h-6"
        src={ai_starts}
        alt="ai_starts"
      />
      Dokumente automatisch hochladen und zuorden
    </button>
  );
}
