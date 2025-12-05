import { getRelatedLocalsByObjektId } from "@/api";
import { objekte_placeholder } from "@/static/icons";
import { type ObjektType } from "@/types";
import { countLocals } from "@/utils";
import Image from "next/image";
import Link from "next/link";

export default async function ObjekteItemDoc({
  item,
  docLink,
}: {
  item: ObjektType;
  docLink: string;
}) {
  if (!item.id) {
    throw new Error("Missing item.id");
  }

  const relatedLocals = await getRelatedLocalsByObjektId(item.id);

  const { commertialLocals, otherLocals } = countLocals(relatedLocals);

  return (
    <div className="bg-white p-5 max-xl:p-3 max-medium:p-3 rounded-2xl max-xl:rounded-xl flex items-center justify-between">
      <Link
        href={docLink}
        className="flex items-center max-medium:flex-col max-medium:items-start w-full justify-start gap-8 max-xl:gap-4 max-medium:gap-2"
      >
        {!!item.image_url ? (
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="w-[218px] h-[112px] max-xl:w-[180px] max-xl:h-[96px] max-medium:w-full max-medium:h-[120px] max-medium:object-cover flex-shrink-0 flex items-center justify-center rounded-2xl max-xl:rounded-xl max-medium:rounded-lg"
            src={item.image_url}
            alt={item.street}
          />
        ) : (
          <div className="w-[218px] h-[112px] max-xl:w-[180px] max-xl:h-[96px] max-medium:w-full max-medium:h-[120px] flex-shrink-0 flex items-center justify-center rounded-2xl max-xl:rounded-xl max-medium:rounded-lg bg-[#E0E0E0]">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-w-[30px] max-h-[30px] max-xl:max-w-[24px] max-xl:max-h-[24px]"
              src={objekte_placeholder}
              alt="objekte_placeholder"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 max-medium:w-full">
          <p className="text-2xl max-xl:text-xl max-medium:text-base font-medium text-dark_green">
            {item.street}
          </p>
          <p className="text-xl max-xl:text-base max-medium:text-sm text-dark_green/50">
            {otherLocals.length > 0
              ? `${otherLocals.length} Wohneinheiten`
              : ""}
            {commertialLocals.length > 0
              ? ` ${commertialLocals.length} Gewerbeeinheiten`
              : ""}
          </p>
        </div>
      </Link>
    </div>
  );
}
