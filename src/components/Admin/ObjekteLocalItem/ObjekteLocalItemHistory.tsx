import type { LocalHistoryType } from "@/types";
import { type RefObject } from "react";
import ObjekteLocalItemHistoryItem from "./ObjekteLocalItemHistoryItem";

export default function ObjekteLocalItemHistory({
  ref,
  history,
}: {
  ref: RefObject<null>;
  history: LocalHistoryType[];
}) {
  console.log(ref);
  return (
    <div
      className="pt-9 pb-2 pl-10 pr-6 [.active_&]:h-auto h-0"
      ref={ref}>
      {history.map((historyItem) => (
        <ObjekteLocalItemHistoryItem
          historyItem={historyItem}
          key={historyItem.id}
        />
      ))}
    </div>
  );
}
