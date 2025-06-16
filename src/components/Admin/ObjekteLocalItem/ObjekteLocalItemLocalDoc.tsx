import { blue_x, green_check_circle } from "@/static/icons";
import { UnitType, type LocalType } from "@/types";
import { buildLocalName, handleLocalTypeIcon } from "@/utils";
import Image from "next/image";
import { getContractsByLocalID } from "@/api";
import Link from "next/link";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";

export type ObjekteLocalItemLocalDocProps = {
  item: LocalType;
  id: string;
  localID?: string;
};

export default async function ObjekteLocalItemLocalDoc({
  item,
  id,
  localID,
}: ObjekteLocalItemLocalDocProps) {
  const contracts = await getContractsByLocalID(localID);

  const status = contracts?.some((contract) => contract.is_current)
    ? "renting"
    : "vacancy";

  const handleStatusImage = () => {
    switch (status) {
      case "vacancy":
        return (
          <span className="flex items-center size-20 justify-center rounded bg-[#E5EBF5]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-8 max-h-8"
              src={blue_x}
              alt="blue_X"
            />
          </span>
        );
      case "renting":
        return (
          <span className="flex items-center size-20 justify-center rounded bg-[#E7F2E8]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-8 max-h-8"
              src={green_check_circle}
              alt="green_check_circle"
            />
          </span>
        );
    }
  };
  const handleStatusBadge = () => {
    switch (status) {
      case "vacancy":
        return (
          <div className="rounded-[20px] min-h-16 min-w-56 flex items-center justify-center gap-4 bg-white text-xl text-[#6083CC] drop-shadow-xl py-3 px-4">
            <span className="bg-[#6083CC] rounded-full size-3 min-w-3 min-h-3" />
            Leerstand
          </div>
        );
      case "renting":
        return (
          <div className="rounded-[20px] min-h-16 min-w-56 flex items-center justify-center gap-4 bg-white text-xl text-green drop-shadow-xl py-3 px-4">
            <span className="bg-green rounded-full size-3 min-w-3 min-h-3" />
            Voll vermietet
          </div>
        );
    }
  };

  return (
    <Link
      href={`${ROUTE_BETRIEBSKOSTENABRECHNUNG}/localauswahl/${id}/${localID}/abrechnungszeitraum`}
      className={`bg-white p-2 rounded-2xl ${status === "vacancy" && "available"} flex items-center justify-between`}>
      <div className="flex items-center justify-start gap-8">
        <div className="flex items-center justify-start gap-2">
          <span className="flex items-center size-20 justify-center rounded bg-[#E7E8EA]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-9 max-h-9"
              src={handleLocalTypeIcon(item.usage_type as UnitType) || ""}
              alt={item.usage_type || ""}
            />
          </span>

          {handleStatusImage()}
        </div>
        <div className="flex cursor-pointer items-center justify-start gap-5">
          <p className="text-2xl text-dark_green">{buildLocalName(item)}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-7">
        {handleStatusBadge()}
      </div>
    </Link>
  );
}
