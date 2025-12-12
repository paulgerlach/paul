import Select from "@/components/Basic/ui/Select";
import {
  useHeizkostenabrechnungStore,
  type HeizkostenabrechnungCostType,
} from "@/store/useHeizkostenabrechnungStore";
import { getCostTypeIconByKey } from "@/utils";
import Image from "next/image";

export type CostTypeItemProps = {
  type: HeizkostenabrechnungCostType;
};

export default function CostTypeSelectItem({ type }: CostTypeItemProps) {
  const { updateAllocationKey } = useHeizkostenabrechnungStore();
  const totalAmount = type.data.reduce(
    (acc, item) => acc + Number(item.total_amount ?? 0),
    0
  );

  return (
    <div className={`bg-white flex items-center justify-between max-medium:flex-col max-medium:items-stretch max-medium:gap-3 py-3 max-medium:py-2 border-b border-gray-100`}>
      {/* Top row: Icon + Title on left, Amount on right */}
      <div className="flex items-center justify-between max-medium:w-full gap-5 max-medium:gap-3">
        <div className="flex items-center gap-5 max-medium:gap-3">
          <div className="size-14 max-w-14 max-h-14 min-w-14 min-h-14 max-xl:size-10 max-xl:max-w-10 max-xl:max-h-10 max-xl:min-h-10 max-xl:min-w-10 max-medium:size-9 max-medium:max-w-9 max-medium:max-h-9 max-medium:min-h-9 max-medium:min-w-9 flex items-center justify-center bg-[#E7F2E8] rounded-full flex-shrink-0">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-7 max-h-7 max-xl:max-w-5 max-xl:max-h-5 max-medium:max-w-4 max-medium:max-h-4"
              src={getCostTypeIconByKey(type.type || "")}
              alt="chevron"
            />
          </div>
          <p className="font-semibold max-xl:text-sm max-medium:text-xs text-dark_green">
            {type.name}
          </p>
        </div>
        <span className="whitespace-nowrap max-medium:text-sm font-medium bg-gray-100 px-2 py-1 rounded hidden max-medium:block">{totalAmount} €</span>
      </div>
      {/* Desktop: amount + select on right | Mobile: select centered */}
      <div className="flex items-center justify-end max-medium:justify-center max-medium:w-full gap-5 max-medium:gap-3">
        <span className="whitespace-nowrap max-medium:hidden">{totalAmount} €</span>
        <Select
          label=""
          placeholder=""
          options={["Verbrauch", "m2 Wohnfläche", "Wohneinheiten"]}
          selectedValue={type.allocation_key ? type.allocation_key : ""}
          onChange={(val) =>
            updateAllocationKey(
              type.type,
              val as HeizkostenabrechnungCostType["allocation_key"]
            )
          }
        />
      </div>
    </div>
  );
}
