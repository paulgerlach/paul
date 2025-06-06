import { ContractType } from "@/types";
import ObjekteLocalItemHistoryItem from "./ObjekteLocalItemHistoryItem";

export default function ObjekteLocalItemHistory({
  history,
  objektID,
  localID,
}: {
  history?: ContractType[];
  objektID: string;
  localID?: string;
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
