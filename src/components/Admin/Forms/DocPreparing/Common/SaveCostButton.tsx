"use client";

import { Button } from "@/components/Basic/ui/Button";
import { editCostType } from "@/actions/edit/editCostType";
import type { DocCostCategoryType } from "@/types";
import { useRouter } from "next/navigation";
import {
  ROUTE_BETRIEBSKOSTENABRECHNUNG,
  ROUTE_HEIZKOSTENABRECHNUNG,
} from "@/routes/routes";
import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { submitBuildingDocument } from "@/actions/edit/submitBuildingDocument";
import { submitHeatLocalDocument } from "@/actions/edit/submitHeatLocalDocument";

export default function SaveCostButton({
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
  localId?: string;
}) {
  const router = useRouter();
  const { documentGroups: betriebskostenGroups } =
    useBetriebskostenabrechnungStore();
  const { documentGroups: heizkostenGroups } = useHeizkostenabrechnungStore();

  const documentGroups =
    documentType === "betriebskostenabrechnung"
      ? betriebskostenGroups
      : heizkostenGroups;

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
              documentType,
              item.id ?? ""
            )
          )
      );

      let redirectUrl = "";
      if (documentType === "betriebskostenabrechnung") {
        await submitBuildingDocument(operatingDocId);
        redirectUrl = `${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objektId}/${operatingDocId}/results`;
      } else {
        await submitHeatLocalDocument(operatingDocId);
        if (localId) {
          redirectUrl = `${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektId}/${localId}/${operatingDocId}/results`;
        } else {
          redirectUrl = `${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/${operatingDocId}/results`;
        }
      }
      router.push(redirectUrl);
    } catch (err) {
      console.error(err);
    }
  };

  return <Button onClick={handleSave}>Weiter</Button>;
}
