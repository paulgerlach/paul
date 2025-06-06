import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import database from "@/db";
import { locals } from "@/db/drizzle/schema";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { type ObjektType } from "@/types";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function ObjekteItem({ item }: { item: ObjektType }) {
  if (!item.id) {
    throw new Error("Missing item.id");
  }

  const relatedLocals = (
    await database.select().from(locals).where(eq(locals.objekt_id, item.id))
  ).map((local) => ({
    ...local,
    living_space: Number(local.living_space),
    rooms: local.rooms ? Number(local.rooms) : null,
    house_fee: local.house_fee ? Number(local.house_fee) : null,
    tags: null,
    heating_systems: null,
    documents: null,
  }));

  const commertialLocals = relatedLocals.filter(
    (local) => local.usage_type === "commercial"
  );

  const otherLocals = relatedLocals.filter(
    (local) =>
      local.usage_type !== "commercial" && local.usage_type !== "parking"
  );

  return (
    <div className="bg-white p-4 rounded-2xl flex items-center justify-between">
      <Link
        href={`${ROUTE_OBJEKTE}/${item.id}`}
        className="flex items-center w-full justify-start gap-8">
        {/* {!!item.image ? (
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-[218px] max-h-[112px] rounded-2xl"
            src={item.image}
            alt={item.street}
          />
        ) : ( */}
        <div className="w-[218px] h-[112px] rounded-2xl bg-card_light" />
        {/* )} */}
        <div>
          <p className="text-2xl text-dark_green">{item.street}</p>
          <p className="text-base text-dark_green/50">
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
