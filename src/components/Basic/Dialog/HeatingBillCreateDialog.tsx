"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../ui/DialogBase";

export default function HeatingBillCreateDialog() {
  const { openDialogByType, closeDialog } = useDialogStore();
  const isOpen = openDialogByType.heating_bill_create;

  if (isOpen)
    return (
      <DialogBase dialogName="local_delete">
        <h2>Auswahl der Objektart</h2>
        <p>
          Für welches Einheit möchten Sie die Heizkostenabrechnung erstellen?
          Bei einem Gebäude mit mehreren Einheiten oder einem Einfamilienhaus
          werden automatisch Ihre Vertrags- und Rechnungsdaten übernommen. Bei
          einer Eigentumswohnung (wenn Teil einer WEG) können Sie die Abrechnung
          schnell und einfach anhand der Hausgeldabrechnung fertig stellen.
        </p>
      </DialogBase>
    );  
}
