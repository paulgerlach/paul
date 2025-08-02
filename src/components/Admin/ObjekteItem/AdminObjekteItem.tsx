import { getRelatedLocalsByObjektId } from "@/api";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import { ROUTE_ADMIN, ROUTE_OBJEKTE } from "@/routes/routes";
import { type ObjektType } from "@/types";
import { countLocals } from "@/utils";
import Link from "next/link";
import AdminEditObjekteImageButton from "./AdminEditObjekteImageButton";

export default async function AdminObjekteItem({
  item,
  userID,
}: {
  item: ObjektType;
  userID: string;
}) {
  if (!item.id) {
    throw new Error("Missing item.id");
  }

  const relatedLocals = await getRelatedLocalsByObjektId(item.id);

  const { commertialLocals, otherLocals } = countLocals(relatedLocals);

  return (
    <div className="bg-white p-5 max-xl:p-3 rounded-2xl max-xl:rounded-xl flex items-center justify-between">
      <div className="flex items-center w-full justify-start gap-8 max-xl:gap-4">
        <AdminEditObjekteImageButton item={item} />
        <Link
          href={`${ROUTE_ADMIN}/${userID}${ROUTE_OBJEKTE}/${item.id}`}
          className="flex flex-col w-full items-between justify-start gap-2 max-xl:gap-1 min-h-full h-full"
        >
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
        </Link>
      </div>
      <ThreeDotsButton
        editLink={`${ROUTE_ADMIN}${ROUTE_OBJEKTE}/${item.id}/edit`}
        itemID={item.id}
        dialogAction="object_delete"
      />
    </div>
  );
}
