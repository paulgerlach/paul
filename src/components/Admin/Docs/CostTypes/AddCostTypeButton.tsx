import { cost_type_plus } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";
import type { DialogStoreActionType } from "@/types";
import Image from "next/image";

export default function AddCostTypeButton({ dialogType }: { dialogType: DialogStoreActionType }) {
    const { openDialog } = useDialogStore();
    return (
        <button
            onClick={() => openDialog(dialogType)}
            className="border-dashed w-full cursor-pointer flex py-3 px-16 max-xl:px-10 items-center justify-start text-base text-dark_green/50 border border-dark_green gap-5 rounded max-xl:text-sm">
            <span className="flex items-center justify-center size-12 max-w-12 max-h-12 min-h-12 min-w-12 bg-[#E7F2E8] rounded-full">
                <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-6 max-h-6 max-xl:max-w-4 max-xl:max-h-4"
                    src={cost_type_plus}
                    alt="cost_type_plus"
                />
            </span>
            Weitere Kostenkategorie hinzufügen
        </button>
    )
}