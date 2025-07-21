"use client";

import { Button } from "@/components/Basic/ui/Button";
import { editCostType } from "@/actions/edit/editCostType";
import type { DocCostCategoryType } from "@/types";
import { useRouter } from "next/navigation";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { submitLocalDocument } from "@/actions/edit/submitLocalDocument";

export default function SaveLocalCostButton({
  initialDocumentGroups,
  documentType,
  operatingDocId,
  objektId,
  localId,
}: {
  initialDocumentGroups: DocCostCategoryType[];
  documentType: "heizkostenabrechnung" | "betriebskostenabrechnung";
  operatingDocId: string;
  objektId: string;
  localId: string;
}) {
  const { documentGroups } = useHeizkostenabrechnungStore();
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

      await submitLocalDocument(operatingDocId);
      router.push(
        `${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/${localId}/${operatingDocId}/results`
      );
    } catch (err) {
      console.error(err);
    }
  };

  return <Button onClick={handleSave}>Weiter</Button>;
}
