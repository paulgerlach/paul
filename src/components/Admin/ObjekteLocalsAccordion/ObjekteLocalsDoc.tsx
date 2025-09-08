import type { LocalType } from "@/types";
import ObjekteLocalItemDoc from "../ObjekteLocalItem/ObjekteLocalItemDoc";

export default function ObjekteLocalsDoc({
  locals,
  id,
}: {
  id: string;
  locals?: LocalType[];
}) {
  return (
    <div className="overflow-y-auto space-y-4">
      {locals?.map((local) => (
        <ObjekteLocalItemDoc
          id={id}
          localID={local.id}
          key={local.id}
          item={local}
        />
      ))}
    </div>
  );
}
