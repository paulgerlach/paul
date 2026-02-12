import { blue_x, gmail, green_check_circle, pdf_icon } from "@/static/icons";
import { UnitType, type LocalType } from "@/types";
import { buildLocalName, handleLocalTypeIcon } from "@/utils";
import Image from "next/image";
import { getAdminContractsWithContractorsByLocalID } from "@/api";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import Link from "next/link";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import LocalPDFDownloadButton from "../../Docs/Render/HeidiSystemsPdf/LocalPDFDownloadButton";

export type ObjekteLocalItemHeatingBillDocResultProps = {
  item: LocalType;
  objektID: string;
  userID: string;
  docID?: string;
  docType: "localauswahl" | "objektauswahl";
};

export default async function AdminObjekteLocalItemHeatingBillDocResult({
  item,
  objektID,
  userID,
  docID,
  docType,
}: ObjekteLocalItemHeatingBillDocResultProps) {
  const contracts = await getAdminContractsWithContractorsByLocalID(
    item.id,
    userID
  );

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

  const previewLink =
    docType === "objektauswahl"
      ? `${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/${objektID}/${docID}/results/${item.id}/preview`
      : `${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/${objektID}/${docID}/results/preview`;

  return (
    <div
      className={`bg-white p-2 max-medium:p-3 rounded-2xl max-medium:rounded-xl ${
        status === "vacancy" && "available"
      } flex items-center justify-between max-medium:flex-col max-medium:items-start max-medium:gap-3`}
    >
      <div className="flex items-center justify-start gap-8 max-medium:gap-3 max-medium:w-full max-medium:justify-between">
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
        {/* Three dots on mobile - next to title on the right */}
        <div className="hidden max-medium:block">
          <ThreeDotsButton
            dialogAction="admin_heating_bill_delete"
            editLink={`${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/weitermachen/${docID}/abrechnungszeitraum`}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-12 max-medium:gap-3 max-medium:w-full max-medium:justify-center max-medium:mt-2">
        {/* <div className="rounded-[20px] min-h-16 min-w-48 max-xl:min-h-12 max-xl:min-w-36 flex items-start justify-center flex-col bg-white shadow-sm py-3 px-4">
          <span className="text-base max-xl:text-sm text-[#757575]">
            Differenz:
          </span>
          <span className="text-xl max-xl:text-base text-[#757575] font-bold">
            -124,56 €
          </span>
        </div> */}
        <div className="flex items-center justify-end max-medium:justify-center gap-4 max-medium:gap-3">
          <Link href={previewLink}>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-10 max-h-10 max-xl:max-w-6 max-xl:max-h-6 max-medium:max-w-8 max-medium:max-h-8"
              src={pdf_icon}
              alt={"pdf_icon"}
            />
          </Link>
          <LocalPDFDownloadButton
            objektId={objektID}
            localId={item.id ?? ""}
            docId={docID ?? ""}
          />
          <button>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-[35px] max-h-[35px] max-xl:max-w-6 max-xl:max-h-6 max-medium:max-w-8 max-medium:max-h-8"
              src={gmail}
              alt={"gmail_icon"}
            />
          </button>
          {/* Three dots on desktop - with action icons */}
          <div className="max-medium:hidden">
            <ThreeDotsButton
              dialogAction="admin_heating_bill_delete"
              editLink={`${ROUTE_ADMIN}/${userID}${ROUTE_HEIZKOSTENABRECHNUNG}/${docType}/weitermachen/${docID}/abrechnungszeitraum`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
