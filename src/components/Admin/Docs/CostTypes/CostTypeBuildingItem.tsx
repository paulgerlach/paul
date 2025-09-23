import TheeDotsCostTypeButton from "@/components/Basic/TheeDotsButton/TheeDotsCostTypeButton";
import { admin_plus, chevron_admin, pdf_icon } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";
import {
  type BetriebskostenabrechnungCostType,
  useBetriebskostenabrechnungStore,
} from "@/store/useBetriebskostenabrechnungStore";
import { getCostTypeIconByKey, slideDown, slideUp } from "@/utils";
import Image from "next/image";
import { useEffect, useRef } from "react";

export type CostTypeBuildingItemProps = {
  isOpen: boolean;
  index: number;
  onClick: (index: number) => void;
  type: BetriebskostenabrechnungCostType;
  objektId: string;
  operatingDocId: string;
};

export default function CostTypeBuildingItem({
  isOpen,
  index,
  onClick,
  type,
  objektId,
  operatingDocId,
}: CostTypeBuildingItemProps) {
  const contentRef = useRef(null);
  const { openDialog } = useDialogStore();
  const {
    setActiveCostType,
    setObjektID,
    setPurposeOptions,
    setOperatingDocID,
  } = useBetriebskostenabrechnungStore();

  useEffect(() => {
    if (isOpen) {
      slideDown(contentRef.current);
    } else {
      slideUp(contentRef.current);
    }
  }, [isOpen]);

  const handleOpenDialog = () => {
    setActiveCostType(type.type);
    setObjektID(objektId);
    setOperatingDocID(operatingDocId);
    setPurposeOptions();
    openDialog(`${type.type}_betriebskostenabrechnung_upload`);
  };

  const totalAmount = type.data.reduce(
    (acc, item) => acc + Number(item.total_amount ?? 0),
    0
  );

  return (
    <div className={`bg-[#F5F5F5] rounded-md ${isOpen ? `active` : ""}`}>
      <div
        className={`bg-white py-3 px-6 flex items-center justify-between border border-[#E7E9ED] rounded-md`}
      >
        <div
          className="flex cursor-pointer items-center justify-start gap-5 w-full"
          onClick={() => onClick(index)}
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-5 max-h-4 max-xl:max-w-3 max-xl:max-h-3 [.active_&]:-rotate-90 transition-all duration-300"
            src={chevron_admin}
            alt="chevron"
          />
          <div className="size-14 max-w-14 max-h-14 min-w-14 min-h-14 max-xl:size-10 max-xl:max-w-10 max-xl:max-h-10 max-xl:min-h-10 max-xl:min-w-10 flex items-center justify-center bg-[#E7F2E8] rounded-full">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-7 max-h-7 max-xl:max-w-5 max-xl:max-h-5"
              src={getCostTypeIconByKey(type.type || "")}
              alt="chevron"
            />
          </div>
          <p className="font-semibold text-dark_green">{type.name}</p>
        </div>
        <div className="flex items-center whitespace-nowrap justify-end gap-7">
          <span>{totalAmount} €</span>
          <TheeDotsCostTypeButton
            editDialogAction="cost_type_betriebskostenabrechnung_edit"
            itemID={type.id ?? ""}
            userID={type.user_id}
            deleteDialogAction="cost_type_betriebskostenabrechnung_delete"
          />
        </div>
      </div>
      <div
        ref={contentRef}
        className="[.active_&]:py-5 px-5 [.active_&]:h-auto h-0"
      >
        {type.data.map((item, i) => {
          if (item.document?.length === 1 || item.document_name) {
            return (
              <ul key={i} className="mt-4 mb-9 max-xl:mt-2 max-xl:mb-5">
                <li className="flex justify-between items-center pl-12 max-xl:pl-6">
                  <span className="text-sm flex items-center gap-12 max-xl:gap-6 truncate text-[#757575]">
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
          className="flex items-center [.available_&]:mx-3 w-fit justify-center gap-2 px-6 py-5 max-xl:py-2.5 max-xl:px-3 border border-dark_green rounded-md bg-[#E0E0E0] text-sm font-medium text-admin_dark_text"
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-4 max-h-4 max-xl:max-w-3 max-xl:max-h-3"
            src={admin_plus}
            alt="admin_plus"
          />
          Ausgaben hinzufügen
        </button>
      </div>
    </div>
  );
}
