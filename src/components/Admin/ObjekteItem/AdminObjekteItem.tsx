import { getRelatedLocalsByObjektId } from "@/api";
import ThreeDotsButton from "@/components/Basic/TheeDotsButton/TheeDotsButton";
import { type ObjektType } from "@/types";
import { countLocals } from "@/utils";
import Link from "next/link";
import AdminEditObjekteImageButton from "./AdminEditObjekteImageButton";
import { buildSubRoute } from "@/lib/navigation";

export default async function AdminObjekteItem({ item }: { item: ObjektType }) {
  if (!item.id) {
    throw new Error("Missing item.id");
  }

  const relatedLocals = await getRelatedLocalsByObjektId(item.id);

  const { commertialLocals, otherLocals } = countLocals(relatedLocals);

  const innerLink = await buildSubRoute(item.id);
  const editLink = await buildSubRoute(`${item.id}/edit`);

  return (
    <div className="bg-white p-5 max-xl:p-3 rounded-2xl max-xl:rounded-xl flex items-center justify-between">
      <div className="flex items-center w-full justify-start gap-8 max-xl:gap-4">
        <AdminEditObjekteImageButton item={item} />
        <Link
          href={innerLink}
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
        editLink={editLink}
        itemID={item.id}
        dialogAction="admin_object_delete"
      />
    </div>
  );
}
