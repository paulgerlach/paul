"use client";

import { useState } from "react";
import { Button } from "@/components/Basic/ui/Button";
import { editCostType } from "@/actions/edit/editCostType";
import type { DocCostCategoryType } from "@/types";
import { useRouter } from "next/navigation";
import {
  ROUTE_ADMIN,
  ROUTE_BETRIEBSKOSTENABRECHNUNG,
  ROUTE_HEIZKOSTENABRECHNUNG,
} from "@/routes/routes";
import { useBetriebskostenabrechnungStore } from "@/store/useBetriebskostenabrechnungStore";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { submitBuildingDocument } from "@/actions/edit/submitBuildingDocument";
import { submitHeatLocalDocument } from "@/actions/edit/submitHeatLocalDocument";

export default function AdminSaveCostButton({
  initialDocumentGroups,
  documentType,
  operatingDocId,
  objektId,
  localId,
  userId,
}: {
  initialDocumentGroups: DocCostCategoryType[];
  documentType: "heizkostenabrechnung" | "betriebskostenabrechnung";
  operatingDocId: string;
  objektId: string;
  localId?: string;
  userId?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { documentGroups: betriebskostenGroups } =
    useBetriebskostenabrechnungStore();
  const { documentGroups: heizkostenGroups } = useHeizkostenabrechnungStore();

  const documentGroups =
    documentType === "betriebskostenabrechnung"
      ? betriebskostenGroups
      : heizkostenGroups;

  const runBatchGeneration = async (objektId: string, docId: string) => {
    const res = await fetch("/api/generate-heating-bill/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objektId, docId }),
    });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        details?: string;
      };
      const message = payload.error ?? payload.details ?? "Batch generation failed";
      throw new Error(message);
    }
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
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
        redirectUrl = `${ROUTE_ADMIN}/${userId}${ROUTE_BETRIEBSKOSTENABRECHNUNG}/objektauswahl/${objektId}/${operatingDocId}/results`;
      } else {
        await submitHeatLocalDocument(operatingDocId);
        if (localId) {
          redirectUrl = `${ROUTE_ADMIN}/${userId}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objektId}/${localId}/${operatingDocId}/results`;
        } else {
          redirectUrl = `${ROUTE_ADMIN}/${userId}${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objektId}/${operatingDocId}/results`;
          await runBatchGeneration(objektId, operatingDocId);
        }
      }
      router.push(redirectUrl);
    } catch (err) {
      console.error(err);
      alert("PDF-Generierung fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button onClick={handleSave} disabled={isSubmitting}>
      {isSubmitting ? "Wird generiert..." : "Weiter"}
    </Button>
  );
}
