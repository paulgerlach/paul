import { getRelatedLocalsByObjektId } from "@/api";
import { type ObjektType } from "@/types";
import { countLocals } from "@/utils";
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
    <div className="bg-white p-4 rounded-2xl flex items-center justify-between">
      <Link
        href={docLink}
        className="flex items-center w-full justify-start gap-8">
        <div className="w-[218px] h-[112px] rounded-2xl bg-card_light" />
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
      </Link>
    </div>
  );
}
