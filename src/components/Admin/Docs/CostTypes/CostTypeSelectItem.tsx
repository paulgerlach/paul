import Select from "@/components/Basic/ui/Select";
import {
  useHeizkostenabrechnungStore,
  type HeizkostenabrechnungCostType,
} from "@/store/useHeizkostenabrechnungStore";
import { getCostTypeIconByKey, getCostTypeNameByKey } from "@/utils";
import Image from "next/image";

export type CostTypeItemProps = {
  type: HeizkostenabrechnungCostType;
  objektId: string;
  localId: string;
};

export default function CostTypeSelectItem({
  type,
  objektId,
  localId,
}: CostTypeItemProps) {
  const { updateAllocationKey } = useHeizkostenabrechnungStore();
  const totalAmount = type.data.reduce(
    (acc, item) => acc + Number(item.total_amount ?? 0),
    0
  );

  return (
    <div className={`bg-white flex items-center justify-between`}>
      <div className="flex items-center justify-start gap-5 w-full">
        <div className="size-14 max-w-14 max-h-14 min-w-14 min-h-14 flex items-center justify-center bg-[#E7F2E8] rounded-full">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-7 max-h-7"
            src={getCostTypeIconByKey(type.type)!}
            alt="chevron"
          />
        </div>
        <p className="font-semibold text-dark_green">
          {getCostTypeNameByKey(type.type)}
        </p>
      </div>
      <div className="flex items-center justify-end w-full gap-5">
        <span className="whitespace-nowrap">{totalAmount} €</span>
        <Select
          label=""
          placeholder=""
          options={["Verbrauch", "m2 Wohnfläche", "Wohneinheiten"]}
          selectedValue={type.allocation_key}
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
