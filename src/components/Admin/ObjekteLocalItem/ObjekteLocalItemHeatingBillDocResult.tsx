import { blue_x, green_check_circle } from "@/static/icons";
import { UnitType, type LocalType } from "@/types";
import { buildLocalName, handleLocalTypeIcon } from "@/utils";
import Image from "next/image";
import { getContractsWithContractorsByLocalID } from "@/api";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import TenantDocumentActions from "@/components/Admin/ObjekteLocalItem/Admin/TenantDocumentActions";
import type { TenantDocument } from "@/components/Admin/ObjekteLocalItem/ObjekteObjektItemHeatingBillDocResult";

export type ObjekteLocalItemHeatingBillDocResultProps = {
  item: LocalType;
  id: string;
  docID?: string;
  docType: "localauswahl" | "objektauswahl";
  tenantDocuments?: TenantDocument[];
};

export default async function ObjekteLocalItemHeatingBillDocResult({
  item,
  id,
  docID,
  docType,
  tenantDocuments = [],
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

  const editLink = `${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/weitermachen/${docID}/abrechnungszeitraum`;

  const previewBaseHref = `${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/${id}/${item.id}/${docID}/results/preview`;

  const singleDoc = tenantDocuments.length === 1 ? tenantDocuments[0] : null;
  const hasMultipleDocs = tenantDocuments.length > 1;

  return (
    <div className="bg-white rounded-2xl max-medium:rounded-xl overflow-hidden">
      {/* Main row: locale info + actions */}
      <div
        className={`p-2 max-medium:p-3 ${status === "vacancy" && "available"
          } flex items-center justify-between max-medium:flex-col max-medium:items-start max-medium:gap-3`}
      >
        <div className="flex items-center justify-start gap-8 max-medium:gap-3">
          <div className="flex items-center gap-8 max-medium:gap-3">
            <div className="flex items-center justify-start gap-2 max-medium:gap-1.5 flex-shrink-0">
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
            <div className="flex cursor-pointer items-center justify-start gap-5 max-medium:gap-2 max-medium:min-w-0">
              <p className="text-2xl max-xl:text-lg max-medium:text-sm text-dark_green max-medium:break-words max-medium:line-clamp-2">
                {buildLocalName(item)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Inline action buttons when single document */}
          {singleDoc && (
            <TenantDocumentActions
              documentId={singleDoc.id}
              previewHref={`${previewBaseHref}?documentId=${singleDoc.id}`}
            />
          )}
          <ThreeDotsButton
            dialogAction="heating_bill_delete"
            editLink={editLink}
          />
        </div>
      </div>

      {/* Tenant documents sublist — only for multiple documents */}
      {hasMultipleDocs && (
        <div className="border-t border-gray-100 ml-6 max-medium:ml-4 border-l-2 border-l-gray-50 bg-gray-50/30">
          {tenantDocuments.map((doc) => {
            const previewHref = `${previewBaseHref}?documentId=${doc.id}`;

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between pl-6 pr-4 py-3 max-medium:pl-4 max-medium:pr-3 max-medium:py-2 hover:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <p className="text-base max-xl:text-sm max-medium:text-xs text-dark_green/70 truncate">
                  {doc.tenantName || "\u00A0"}
                </p>
                <TenantDocumentActions
                  documentId={doc.id}
                  previewHref={previewHref}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
