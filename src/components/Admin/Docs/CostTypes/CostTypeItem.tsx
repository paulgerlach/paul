import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import { admin_plus, chevron_admin, pdf_icon } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";
import {
  type HeizkostenabrechnungCostType,
  useHeizkostenabrechnungStore,
} from "@/store/useHeizkostenabrechnungStore";
import {
  getCostTypeIconByKey,
  slideDown,
  slideUp,
} from "@/utils";
import Image from "next/image";
import { useEffect, useRef } from "react";

export type CostTypeItemProps = {
  isOpen: boolean;
  index: number;
  onClick: (index: number) => void;
  type: HeizkostenabrechnungCostType;
  objektId: string;
  localId: string;
};

export default function CostTypeItem({
  isOpen,
  index,
  onClick,
  type,
  objektId,
  localId,
}: CostTypeItemProps) {
  const contentRef = useRef(null);
  const { openDialog } = useDialogStore();
  const { setActiveCostType, setLocalID, setObjektID, setPurposeOptions } =
    useHeizkostenabrechnungStore();

  useEffect(() => {
    if (isOpen) {
      slideDown(contentRef.current);
    } else {
      slideUp(contentRef.current);
    }
  }, [isOpen]);

  const handleOpenDialog = () => {
    setActiveCostType(type.type);
    setLocalID(localId);
    setObjektID(objektId);
    setPurposeOptions();
    openDialog(`${type.type}_upload`);
  };

  const totalAmount = type.data.reduce(
    (acc, item) => acc + Number(item.total_amount ?? 0),
    0
  );

  return (
    <div className={`bg-[#F5F5F5] rounded-md ${isOpen ? `active` : ""}`}>
      <div
        className={`bg-white py-3 px-6 flex items-center justify-between border border-[#E7E9ED] rounded-md`}>
        <div
          className="flex cursor-pointer items-center justify-start gap-5 w-full"
          onClick={() => onClick(index)}>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-5 max-h-4 [.active_&]:-rotate-90 transition-all duration-300"
            src={chevron_admin}
            alt="chevron"
          />
          <div className="size-14 max-w-14 max-h-14 min-w-14 min-h-14 flex items-center justify-center bg-[#E7F2E8] rounded-full">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-7 max-h-7"
              src={getCostTypeIconByKey(type.type || "")}
              alt="chevron"
            />
          </div>
          <p className="font-semibold text-dark_green">
            {type.name}
          </p>
        </div>
        <div className="flex items-center whitespace-nowrap justify-end gap-7">
          <span>{totalAmount} €</span>
          <ThreeDotsButton
            editLink={""}
            itemID={""}
            dialogAction="local_delete"
          />
        </div>
      </div>
      <div
        ref={contentRef}
        className="[.active_&]:py-5 px-5 [.active_&]:h-auto h-0">
        {type.data.map((item, i) => {
          if (item.document?.length === 1 || item.document_name) {
            return (
              <ul key={i} className="mt-4 mb-9">
                <li className="flex justify-between items-center pl-12">
                  <span className="text-sm flex items-center gap-12 truncate text-[#757575]">
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      loading="lazy"
                      className="block mx-auto"
                      src={pdf_icon}
                      alt="pdf_icon"
                    />
                    {item.document_name ?? item.document?.[0]?.name}
                  </span>
                </li>
              </ul>
            );
          }
          return null;
        })}
        <button
          onClick={() => handleOpenDialog()}
          className="flex items-center [.available_&]:mx-3 w-fit justify-center gap-2 px-6 py-4 border border-dark_green cursor-pointer rounded-md bg-[#E0E0E0] text-lg font-medium text-admin_dark_text">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-4 max-h-4"
            src={admin_plus}
            alt="admin_plus"
          />
          Ausgaben hinzufügen
        </button>
      </div>
    </div>
  );
}
