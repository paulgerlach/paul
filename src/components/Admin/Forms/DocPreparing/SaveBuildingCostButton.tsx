"use client";

import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";
import { Button } from "@/components/Basic/ui/Button";
import { editCostType } from "@/actions/edit/editCostType";
import type { DocCostCategoryType } from "@/types";
import { useRouter } from "next/navigation";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import { submitBuildingDocument } from "@/actions/edit/submitBuildingDocument";

export default function SaveBuildingCostButton({
  initialDocumentGroups,
  documentType,
  operatingDocId,
  objektId,
}: {
  initialDocumentGroups: DocCostCategoryType[];
  documentType: string;
  operatingDocId: string;
  objektId: string;
}) {
  const { documentGroups } = useBetriebskostenabrechnungStore();
  const router = useRouter();

  const handleSave = async () => {
    try {
      const changedItems = documentGroups.filter((current) => {
        const initial = initialDocumentGroups.find(
          (init) => init.id === current.id
        );
        return initial && initial.allocation_key !== current.allocation_key;
      });

      await Promise.all(
        changedItems
          .filter(
            (item) =>
              item.allocation_key !== null && item.allocation_key !== undefined
          )
          .map((item) =>
            editCostType(
              {
                allocation_key: item.allocation_key ?? "Verbrauch",
                name: item.name ?? "",
                type: item.type ?? "",
              },
              documentType as
                | "heizkostenabrechnung"
                | "betriebskostenabrechnung",
              item.id ?? ""
            )
          )
      );

      await submitBuildingDocument(operatingDocId);
      router.push(
        `${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objektId}/${operatingDocId}/results`
      );
    } catch (err) {
      console.error(err);
    }
  };

  return <Button onClick={handleSave}>Weiter</Button>;
}
