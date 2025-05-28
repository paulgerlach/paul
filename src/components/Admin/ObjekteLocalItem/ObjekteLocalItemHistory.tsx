import type { TenantType } from "@/types";
import { type RefObject } from "react";
import ObjekteLocalItemHistoryItem from "./ObjekteLocalItemHistoryItem";

export default function ObjekteLocalItemHistory({
  ref,
  history,
  objektID,
  localID,
}: {
  ref: RefObject<null>;
  history?: TenantType[];
  objektID: string;
  localID: string;
}) {
  return (
    <div className="pt-9 pb-2 pl-10 pr-6 [.active_&]:h-auto h-0" ref={ref}>
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
