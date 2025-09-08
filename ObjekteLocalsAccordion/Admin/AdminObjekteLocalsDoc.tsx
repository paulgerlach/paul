import type { LocalType } from "@/types";
import AdminObjekteLocalItemDoc from "../../src/components/Admin/ObjekteLocalItem/Admin/AdminObjekteLocalItemDoc";

export default function AdminObjekteLocalsDoc({
  locals,
  objektID,
  userID,
}: {
  objektID: string;
  userID: string;
  locals?: LocalType[];
}) {
  return (
    <div className="overflow-y-auto space-y-4">
      {locals?.map((local) => (
        <AdminObjekteLocalItemDoc
          objektID={objektID}
          userID={userID}
          localID={local.id}
          key={local.id}
          item={local}
        />
      ))}
    </div>
  );
}
