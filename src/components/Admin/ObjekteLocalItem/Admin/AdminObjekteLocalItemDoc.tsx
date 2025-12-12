import { blue_x, green_check_circle } from "@/static/icons";
import { UnitType, type LocalType } from "@/types";
import { buildLocalName, handleLocalTypeIcon } from "@/utils";
import Image from "next/image";
import { getAdminContractsByLocalID } from "@/api";
import Link from "next/link";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export type ObjekteLocalItemDocProps = {
  item: LocalType;
  objektID: string;
  userID: string;
  localID?: string;
};

export default async function AdminObjekteLocalItemDoc({
  item,
  objektID,
  userID,
  localID,
}: ObjekteLocalItemDocProps) {
  const contracts = await getAdminContractsByLocalID(localID, userID);

  const status = contracts?.some((contract) => contract.is_current)
    ? "renting"
    : "vacancy";

  const handleStatusImage = () => {
    switch (status) {
      case "vacancy":
        return (
          <span className="flex items-center size-20 max-xl:size-14 max-medium:size-10 justify-center rounded bg-[#E5EBF5]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-8 max-h-8 max-xl:max-w-6 max-xl:max-h-6 max-medium:max-w-4 max-medium:max-h-4"
              src={blue_x}
              alt="blue_X"
            />
          </span>
        );
      case "renting":
        return (
          <span className="flex items-center size-20 max-xl:size-14 max-medium:size-10 justify-center rounded bg-[#E7F2E8]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-8 max-h-8 max-xl:max-w-6 max-xl:max-h-6 max-medium:max-w-4 max-medium:max-h-4"
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
          <div className="rounded-[20px] min-h-16 min-w-56 max-xl:min-h-12 max-xl:min-w-40 max-medium:min-h-8 max-medium:min-w-0 max-medium:px-3 max-medium:py-1.5 flex items-center justify-center gap-4 max-medium:gap-2 bg-white text-xl max-xl:text-base max-medium:text-xs text-[#6083CC] drop-shadow-xl py-3 px-4">
            <span className="bg-[#6083CC] rounded-full size-3 min-w-3 min-h-3 max-xl:size-2 max-xl:min-w-2 max-xl:min-h-2 max-medium:size-1.5 max-medium:min-w-1.5 max-medium:min-h-1.5" />
            <span className="max-medium:hidden">Leerstand</span>
          </div>
        );
      case "renting":
        return (
          <div className="rounded-[20px] min-h-16 min-w-56 max-xl:min-h-12 max-xl:min-w-40 max-medium:min-h-8 max-medium:min-w-0 max-medium:px-3 max-medium:py-1.5 flex items-center justify-center gap-4 max-medium:gap-2 bg-white text-xl max-xl:text-base max-medium:text-xs text-green drop-shadow-xl py-3 px-4">
            <span className="bg-green rounded-full size-3 min-w-3 min-h-3 max-xl:size-2 max-xl:min-w-2 max-xl:min-h-2 max-medium:size-1.5 max-medium:min-w-1.5 max-medium:min-h-1.5" />
            <span className="max-medium:hidden">Voll vermietet</span>
          </div>
        );
    }
  };

  return (
    <Link
      href={`${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektID}/${localID}/abrechnungszeitraum`}
      className={`bg-white p-2 rounded-2xl max-medium:rounded-xl ${
        status === "vacancy" && "available"
      } flex items-center justify-between max-medium:gap-2`}
    >
      <div className="flex items-center justify-start gap-8 max-medium:gap-2 flex-1 min-w-0">
        <div className="flex items-center justify-start gap-2 max-medium:gap-1 flex-shrink-0">
          <span className="flex items-center size-20 max-xl:size-14 max-medium:size-10 justify-center rounded bg-[#E7E8EA]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-9 max-h-9 max-xl:max-w-7 max-xl:max-h-7 max-medium:max-w-4 max-medium:max-h-4"
              src={handleLocalTypeIcon(item.usage_type as UnitType) || ""}
              alt={item.usage_type || ""}
            />
          </span>

          {handleStatusImage()}
        </div>
        <div className="flex cursor-pointer items-center justify-start gap-5 max-medium:gap-1 min-w-0 flex-1">
          <p className="text-2xl max-xl:text-lg max-medium:text-xs text-dark_green max-medium:leading-tight">
            {buildLocalName(item)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-7 max-medium:gap-1 flex-shrink-0">
        {handleStatusBadge()}
      </div>
    </Link>
  );
}
