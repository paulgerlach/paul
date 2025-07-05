"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../ui/DialogBase";
import { allocationKeys } from "@/types";
import { Button } from "../ui/Button";
import { Form } from "../ui/Form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputField from "@/components/Admin/Forms/FormInputField";
import FormSelectField from "@/components/Admin/Forms/FormSelectField";
import { toast } from "sonner";
import FormTagsInput from "@/components/Admin/Forms/FormTagsInput";
import { updateOrCreateCostType } from "@/actions/edit/editCostType";
import { useEffect } from "react";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { useAutoSnakeCase } from "@/hooks/useAutoSnakeCase";

const addCostTypeDialogSchema = z.object({
  type: z.string().min(1, "Pflichtfeld").nullable(),
  name: z.string().min(1, "Pflichtfeld").nullable(),
  allocation_key: z.enum(allocationKeys),
  options: z.array(z.string()).nullable(),
});

export type AddCostTypeDialogFormValues = z.infer<
  typeof addCostTypeDialogSchema
>;

const defaultValues: AddCostTypeDialogFormValues = {
  type: "",
  name: "",
  allocation_key: "Verbrauch",
  options: [],
};

export default function EditBetriebskostenabrechnungCostTypeDialog() {
  const { openDialogByType, closeDialog, itemID } = useDialogStore();
  const { documentGroups } = useHeizkostenabrechnungStore();
  const isOpen = openDialogByType.cost_type_betriebskostenabrechnung_edit;
  const initialValues = documentGroups.find((group) => group.id === itemID);
  const methods = useForm({
    resolver: zodResolver(addCostTypeDialogSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialValues) {
      methods.reset({
        type: initialValues.type ?? "",
        name: initialValues.name ?? "",
        allocation_key: initialValues.allocation_key ?? "Verbrauch",
        options: initialValues.options ?? [],
      });
    }
  }, [initialValues]);

  useAutoSnakeCase(methods, "name", "type");

  if (!isOpen) return null;

  return (
    <DialogBase dialogName={"cost_type_betriebskostenabrechnung_edit"}>
      <p className="font-bold text-lg text-admin_dark_text -mt-6">
        Neue Ausgabeart erstellen
      </p>
      <Form {...methods}>
        <form
          className="flex flex-col justify-between space-y-6 h-full"
          id="cost_type_betriebskostenabrechnung_edit-dialog-form"
          onSubmit={methods.handleSubmit(async (data) => {
            try {
              await updateOrCreateCostType(data, "betriebskostenabrechnung", itemID);
              toast.success("Ausgabe wurde hinzugefügt.");
              methods.reset(defaultValues);
              closeDialog("cost_type_betriebskostenabrechnung_edit");
            } catch {
              toast.error("Fehler beim Speichern.");
            }
          })}>
          <FormInputField<AddCostTypeDialogFormValues>
            control={methods.control}
            name="name"
            label="	Name*"
            placeholder=""
          />
          <FormTagsInput<AddCostTypeDialogFormValues> name="options" control={methods.control} />
          <FormSelectField<AddCostTypeDialogFormValues>
            control={methods.control}
            name="allocation_key"
            label="Verteilungsschlüssel*"
            placeholder=""
            options={["Wohneinheiten", "Verbrauch", "m2 Wohnfläche"]}
          />
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="px-6 py-4 border border-black/20 cursor-pointer rounded-md bg-white text-admin_dark_text text-lg font-medium shadow-xs transition-all duration-300 hover:opacity-80"
              onClick={() => {
                methods.reset(defaultValues);
                closeDialog("cost_type_betriebskostenabrechnung_edit");
              }}>
              Abbrechen
            </button>
            <Button type="submit" className="!font-medium !text-lg">
              Speichern
            </Button>
          </div>
        </form>
      </Form>
    </DialogBase>
  );
}
