import { blue_x, green_check_circle } from "@/static/icons";
import { UnitType, type LocalType } from "@/types";
import { buildLocalName, handleLocalTypeIcon } from "@/utils";
import Image from "next/image";
import { getContractsWithContractorsByLocalID } from "@/api";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import HeatingBillActionButtons from "./HeatingBillActionButtons";

export type TenantInfo = {
  contractId: string;
  contractorsNames: string;
};

export type ObjekteLocalItemHeatingBillDocResultProps = {
  item: LocalType;
  id: string;
  docID?: string;
  docType: "localauswahl" | "objektauswahl";
  tenants?: TenantInfo[];
};

export default async function ObjekteObjektItemHeatingBillDocResult({
  item,
  id,
  docID,
  docType,
  tenants,
}: ObjekteLocalItemHeatingBillDocResultProps) {
  const contracts = await getContractsWithContractorsByLocalID(item.id);

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

  const hasMultipleTenants = tenants && tenants.length > 1;

  return (
    <div
      className={`bg-white p-2 max-medium:p-3 rounded-2xl max-medium:rounded-xl ${status === "vacancy" && "available"
        } flex flex-col max-medium:gap-3`}
    >
      {/* Main row */}
      <div className="flex items-center justify-between max-medium:flex-col max-medium:items-stretch max-medium:gap-3">
        {/* Top row: Icons + Name + Three dots (mobile) */}
        <div className="flex items-center justify-start gap-8 max-medium:gap-3 max-medium:justify-between">
          {/* Icons side by side */}
          <div className="flex items-center justify-start gap-2 max-medium:gap-1.5">
            <span className="flex items-center size-20 max-xl:size-14 max-medium:size-10 justify-center rounded bg-[#E7E8EA]">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-9 max-h-9 max-xl:max-w-7 max-xl:max-h-7 max-medium:max-w-5 max-medium:max-h-5"
                src={handleLocalTypeIcon(item.usage_type as UnitType) || ""}
                alt={item.usage_type || ""}
              />
            </span>

            {handleStatusImage()}
          </div>
          {/* Name + Three dots on mobile */}
          <div className="flex cursor-pointer items-center justify-start gap-3 max-medium:flex-1">
            <p className="text-2xl max-xl:text-lg max-medium:text-base text-dark_green">
              {buildLocalName(item)}
            </p>
            {/* Three dots - visible only on mobile next to title */}
            <div className="hidden max-medium:block">
              <ThreeDotsButton
                dialogAction="heating_bill_delete"
                editLink={`${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/weitermachen/${docID}/abrechnungszeitraum`}
              />
            </div>
          </div>
        </div>
        {/* Bottom row: Action buttons */}
        <HeatingBillActionButtons
          objektId={id}
          localId={item.id ?? ""}
          docId={docID ?? ""}
          previewHref={`${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/${id}/${docID}/results/${item.id}/preview`}
          editLink={`${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/weitermachen/${docID}/abrechnungszeitraum`}
          docType={docType}
          tenants={tenants}
        />
      </div>

      {/* Tenant sub-list when multiple tenants */}
      {hasMultipleTenants && (
        <div className="mt-2 ml-[104px] max-xl:ml-[72px] max-medium:ml-0 border-t border-gray-100 pt-2 space-y-1.5">
          <p className="text-xs text-dark_green/50 font-medium mb-1">
            Mieter im Abrechnungszeitraum:
          </p>
          {tenants.map((tenant) => (
            <div
              key={tenant.contractId}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm text-dark_green/80">
                {tenant.contractorsNames}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
