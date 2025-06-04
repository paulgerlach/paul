import type { TenantType } from "@/types";
import ObjekteLocalItemHistoryItem from "./ObjekteLocalItemHistoryItem";

export default function ObjekteLocalItemHistory({
  history,
  objektID,
  localID,
}: {
  history?: TenantType[];
  objektID: string;
  localID: string;
}) {
  return (
    <div>
      {history?.map((historyItem) => (
        <ObjekteLocalItemHistoryItem
          historyItem={historyItem}
          key={historyItem.id}
          objektID={objektID}
          localID={localID}
        />
      ))}
    </div>
  );
}
