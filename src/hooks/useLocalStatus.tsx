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
          <span className="flex items-center size-20 max-xl:size-14 justify-center rounded bg-[#E5EBF5]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-8 max-h-8 max-xl:max-w-6 max-xl:max-h-6"
              src={blue_x}
              alt="blue_X"
            />
          </span>
        );
      case "renting":
        return (
          <span className="flex items-center size-20 max-xl:size-14 justify-center rounded bg-[#E7F2E8]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-8 max-h-8 max-xl:max-w-6 max-xl:max-h-6"
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
          <div className="rounded-[20px] min-h-16 min-w-56 max-xl:min-h-12 max-xl:min-w-40 flex items-center justify-center gap-4 bg-white text-xl max-xl:text-base text-[#6083CC] drop-shadow-xl py-3 px-4">
            <span className="bg-[#6083CC] rounded-full size-3 min-w-3 min-h-3 max-xl:size-2 max-xl:min-w-2 max-xl:min-h-2" />
            Leerstand
          </div>
        );
      case "renting":
        return (
          <div className="rounded-[20px] min-h-16 min-w-56 max-xl:min-h-12 max-xl:min-w-40 flex items-center justify-center gap-4 bg-white text-xl max-xl:text-base text-green drop-shadow-xl py-3 px-4">
            <span className="bg-green rounded-full size-3 min-w-3 min-h-3 max-xl:size-2 max-xl:min-w-2 max-xl:min-h-2" />
            Voll vermietet
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
