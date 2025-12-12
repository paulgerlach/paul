import { useMemo } from "react";
import Image from "next/image";
import { ContractType } from "@/types";
import { blue_x, green_check_circle } from "@/static/icons";

export function useLocalStatus(contracts?: ContractType[] | null) {
  const status = useMemo<"vacancy" | "renting">(() => {
    return contracts?.some((contract) => contract.is_current)
      ? "renting"
      : "vacancy";
  }, [contracts]);

  const renderStatusImage = () => {
    switch (status) {
      case "vacancy":
        return (
          <span className="flex items-center size-20 max-xl:size-14 max-medium:size-10 justify-center rounded bg-[#E5EBF5]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-8 max-h-8 max-xl:max-w-6 max-xl:max-h-6 max-medium:max-w-5 max-medium:max-h-5"
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
              className="max-w-8 max-h-8 max-xl:max-w-6 max-xl:max-h-6 max-medium:max-w-5 max-medium:max-h-5"
              src={green_check_circle}
              alt="green_check_circle"
            />
          </span>
        );
    }
  };

  const renderStatusBadge = () => {
    switch (status) {
      case "vacancy":
        return (
          <div className="rounded-[20px] min-h-16 min-w-56 max-xl:min-h-12 max-xl:min-w-40 max-medium:min-h-8 max-medium:min-w-0 max-medium:px-3 max-medium:py-1.5 flex items-center justify-center gap-4 max-medium:gap-2 bg-white text-xl max-xl:text-base max-medium:text-xs text-[#6083CC] drop-shadow-sm py-3 px-4">
            <span className="bg-[#6083CC] rounded-full size-3 min-w-3 min-h-3 max-xl:size-2 max-xl:min-w-2 max-xl:min-h-2 max-medium:size-1.5 max-medium:min-w-1.5 max-medium:min-h-1.5" />
            <span className="max-medium:hidden">Leerstand</span>
          </div>
        );
      case "renting":
        return (
          <div className="rounded-[20px] min-h-16 min-w-56 max-xl:min-h-12 max-xl:min-w-40 max-medium:min-h-8 max-medium:min-w-0 max-medium:px-3 max-medium:py-1.5 flex items-center justify-center gap-4 max-medium:gap-2 bg-white text-xl max-xl:text-base max-medium:text-xs text-green drop-shadow-sm py-3 px-4">
            <span className="bg-green rounded-full size-3 min-w-3 min-h-3 max-xl:size-2 max-xl:min-w-2 max-xl:min-h-2 max-medium:size-1.5 max-medium:min-w-1.5 max-medium:min-h-1.5" />
            <span className="max-medium:hidden">Voll vermietet</span>
          </div>
        );
    }
  };

  return {
    status,
    renderStatusImage,
    renderStatusBadge,
  };
}
