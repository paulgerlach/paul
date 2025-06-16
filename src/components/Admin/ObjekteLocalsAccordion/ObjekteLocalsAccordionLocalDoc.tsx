import type { LocalType } from "@/types";
import ObjekteLocalItemLocalDoc from "../ObjekteLocalItem/ObjekteLocalItemLocalDoc";

export default function ObjekteLocalsAccordionLocalDoc({
  locals,
  id,
}: {
  id: string;
  locals?: LocalType[];
}) {
  return (
    <div className="overflow-y-auto space-y-4">
      {locals?.map((local) => (
        <ObjekteLocalItemLocalDoc
          id={id}
          localID={local.id}
          key={local.id}
          item={local}
        />
      ))}
    </div>
  );
}
