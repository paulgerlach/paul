import { blue_x, green_check_circle } from "@/static/icons";
import { UnitType, type LocalType } from "@/types";
import { buildLocalName, handleLocalTypeIcon } from "@/utils";
import Image from "next/image";
import { getAdminContractsWithContractorsByLocalID } from "@/api";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import TenantDocumentActions from "@/components/Admin/ObjekteLocalItem/Admin/TenantDocumentActions";
import TenantDocumentUploadHandler from "@/components/Admin/ObjekteLocalItem/Admin/TenantDocumentUploadHandler";

export type TenantDocument = {
  id: string;
  document_name: string;
  document_url: string;
  tenantName: string;
  current_document: boolean;
  contractId?: string;
  created_at: string;
};

export type ObjekteLocalItemHeatingBillDocResultProps = {
  item: LocalType;
  objektID: string;
  userID: string;
  docID?: string;
  docType: "localauswahl" | "objektauswahl";
  status?: "renting" | "vacancy";
  tenantDocuments?: TenantDocument[];
  isSuperAdmin?: boolean;
  isPending?: boolean;
  pendingTooltip?: string;
};

export default async function AdminObjekteLocalItemHeatingBillDocResult({
  item,
  objektID,
  userID,
  docID,
  docType,
  status: statusFromProps,
  tenantDocuments = [],
  isSuperAdmin = false,
  isPending = false,
  pendingTooltip,
}: Readonly<ObjekteLocalItemHeatingBillDocResultProps>) {
  let status = statusFromProps;
  if (!status) {
    const contracts = await getAdminContractsWithContractorsByLocalID(
      item.id,
      userID
    );
    status = contracts?.some((contract) => contract.is_current)
      ? "renting"
      : "vacancy";
  }

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

  const editLink = `${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/weitermachen/${docID}/abrechnungszeitraum`;

  const previewBaseHref =
    docType === "objektauswahl"
      ? `${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/${objektID}/${docID}/results/${item.id}/preview`
      : `${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/${objektID}/${docID}/results/preview`;

  const singleDoc = tenantDocuments.length === 1 ? tenantDocuments[0] : null;
  const hasMultipleDocs = tenantDocuments.length > 1;

  const groupedDocsByTenant = Object.values(
    tenantDocuments.reduce((acc, doc) => {
      const key = doc.contractId || doc.id;
      if (!acc[key]) {
        acc[key] = { current: undefined, history: [] };
      }
      if (doc.current_document) {
        acc[key].current = doc;
      } else {
        acc[key].history.push(doc);
      }
      return acc;
    }, {} as Record<string, { current?: TenantDocument; history: TenantDocument[] }>)
  ).sort((a, b) => {
    const dateA = (a.current ?? a.history[0])?.created_at ?? "";
    const dateB = (b.current ?? b.history[0])?.created_at ?? "";
    return dateA.localeCompare(dateB);
  });

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
          {/* Pending placeholder actions */}
          {isPending && (
            <TenantDocumentActions
              isPending
              pendingTooltip={pendingTooltip}
            />
          )}
          {/* Inline action buttons when single document */}
          {!isPending && singleDoc && (
            <div className="flex items-center gap-2">
              {!singleDoc.current_document && (
                <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full whitespace-nowrap hidden medium:inline-block">
                  Überschrieben
                </span>
              )}
              <TenantDocumentActions
                documentId={singleDoc.id}
                previewHref={`${previewBaseHref}?documentId=${singleDoc.id}`}
              />
            </div>
          )}
          {!isPending && singleDoc && isSuperAdmin ? (
            <TenantDocumentUploadHandler
              documentId={singleDoc.id}
              editLink={editLink}
              dialogAction="admin_heating_bill_delete"
              disabled={!singleDoc.current_document}
            />
          ) : (
            <ThreeDotsButton
              dialogAction="admin_heating_bill_delete"
              editLink={editLink}
            />
          )}
        </div>
      </div>

      {/* Tenant documents sublist — only for multiple documents */}
      {hasMultipleDocs && (
        <div className="border-t border-gray-100 ml-6 max-medium:ml-4 border-l-2 border-l-gray-50 bg-gray-50/30">
          {groupedDocsByTenant.map((group, groupIdx) => {
            const hasCurrent = !!group.current;
            const groupKey = group.current?.id || group.history[0]?.id || groupIdx;
            return (
              <div key={groupKey} className="flex flex-col border-b border-gray-100 last:border-b-0">
                {/* Active Document */}
                {group.current && (
                  <div className="flex items-center justify-between pl-6 pr-4 py-3 max-medium:pl-4 max-medium:pr-3 max-medium:py-2 transition-colors hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center gap-2 flex-1 min-w-0 pr-4">
                      <p className="text-base max-xl:text-sm max-medium:text-xs text-dark_green/70 truncate">
                        {group.current.tenantName || "\u00A0"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TenantDocumentActions
                        documentId={group.current.id}
                        previewHref={`${previewBaseHref}?documentId=${group.current.id}`}
                      />
                      {isSuperAdmin && (
                        <TenantDocumentUploadHandler
                          documentId={group.current.id}
                          disabled={!group.current.current_document}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Historical Documents nested list */}
                {group.history.length > 0 && (
                  <div className={`${hasCurrent ? 'pl-6 pb-2 pt-1 bg-gray-50/50 border-t border-gray-100/60' : ''} flex flex-col gap-1`}>
                    {group.history.map((histDoc) => (
                      <div
                        key={histDoc.id}
                        className={`flex items-center justify-between ${hasCurrent ? 'pl-4 pr-3 py-2 rounded-md' : 'pl-6 pr-4 py-3 border-b border-gray-100 last:border-b-0'} opacity-75 transition-colors hover:bg-gray-200/50 cursor-pointer`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                            <p className="text-sm max-xl:text-xs text-dark_green/70 truncate">
                              {histDoc.tenantName || group.current?.tenantName || "\u00A0"}
                            </p>
                            <span className="text-[10px] font-medium text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                              Überschrieben
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TenantDocumentActions
                            documentId={histDoc.id}
                            previewHref={`${previewBaseHref}?documentId=${histDoc.id}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
