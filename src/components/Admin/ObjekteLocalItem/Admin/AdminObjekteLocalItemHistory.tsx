import { ContractType } from "@/types";
import AdminObjekteLocalItemHistoryItem from "./AdminObjekteLocalItemHistoryItem";

export default function AdminObjekteLocalItemHistory({
  history,
  localID,
}: {
  history?: ContractType[];
  localID?: string;
}) {
  const sortedHistory = [...(history ?? [])].sort((a, b) => {
    // is_current to top
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;

    // Compare rental_start_date (descending)
    const startA = new Date(a.rental_start_date).getTime();
    const startB = new Date(b.rental_start_date).getTime();
    if (startA !== startB) return startB - startA;

    // If start dates are equal, compare rental_end_date (descending)
    const endA = a.rental_end_date ? new Date(a.rental_end_date).getTime() : 0;
    const endB = b.rental_end_date ? new Date(b.rental_end_date).getTime() : 0;
    return endB - endA;
  });

  return (
    <div className="pl-10 pr-6">
      {sortedHistory.map((historyItem) => (
        <AdminObjekteLocalItemHistoryItem
          historyItem={historyItem}
          key={historyItem.id}
          localID={localID}
        />
      ))}
    </div>
  );
}
