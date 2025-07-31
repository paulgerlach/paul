import { getRelatedLocalsByObjektId } from "@/api";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { objekte_placeholder } from "@/static/icons";
import { type ObjektType } from "@/types";
import { countLocals } from "@/utils";
import Image from "next/image";
import Link from "next/link";

export default async function ObjekteItem({ item }: { item: ObjektType }) {
  if (!item.id) {
    throw new Error("Missing item.id");
  }

  const relatedLocals = await getRelatedLocalsByObjektId(item.id);

  const { commertialLocals, otherLocals } = countLocals(relatedLocals);

  return (
    <div className="bg-white p-5 max-xl:p-3 rounded-2xl max-xl:rounded-xl flex items-center justify-between">
      <Link
        href={`${ROUTE_OBJEKTE}/${item.id}`}
        className="flex items-center w-full justify-start gap-8 max-xl:gap-4"
      >
        {!!item.image_url ? (
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="w-[218px] h-[112px] max-xl:w-[180px] max-xl:h-[96px] flex items-center justify-center rounded-2xl max-xl:rounded-xl"
            src={item.image_url}
            alt={item.street}
          />
        ) : (
          <div className="w-[218px] h-[112px] max-xl:w-[180px] max-xl:h-[96px] flex items-center justify-center rounded-2xl max-xl:rounded-xl bg-[#E0E0E0]">
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
        <div className="flex flex-col items-between justify-start gap-2 max-xl:gap-1 min-h-full h-full">
          <p className="text-3xl max-xl:text-xl text-dark_green">
            {item.street}
          </p>
          <p className="text-xl max-xl:text-base text-dark_green/50">
            {otherLocals.length > 0
              ? `${otherLocals.length} Wohneinheiten`
              : ""}
            {commertialLocals.length > 0
              ? ` ${commertialLocals.length} Gewerbeeinheiten`
              : ""}
          </p>
        </div>

        {/* <div className="flex items-center justify-end gap-7">
          {item.status && (
            <div className="rounded-xl min-h-[100px] min-w-[170px] flex flex-col justify-between bg-white drop-shadow-xl p-3">
              <p className="text-xs font-bold">Leerstandsquote</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{item.percent}%</p>
                  <p
                    className="text-xs whitespace-nowrap"
                    style={{ color: renderTradeColor(item.status) }}>
                    {item.message}
                  </p>
                </div>
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="max-w-7 max-h-5"
                  src={renderTradeIcon(item.status) || ""}
                  alt="trade icon"
                />
              </div>
            </div>
          )}
        </div> */}
      </Link>
      <ThreeDotsButton
        editLink={`${ROUTE_OBJEKTE}/${item.id}/edit`}
        itemID={item.id}
        dialogAction="object_delete"
      />
    </div>
  );
}
