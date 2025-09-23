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
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { useEffect } from "react";
import { useAutoSnakeCase } from "@/hooks/useAutoSnakeCase";
import { useRouter } from "next/navigation";
import { editCostType } from "@/actions/edit/editCostType";

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

export default function EditHeizkostenabrechnungCostTypeDialog() {
  const { openDialogByType, closeDialog, itemID } = useDialogStore();
  const { documentGroups } = useHeizkostenabrechnungStore();
  const isOpen = openDialogByType.cost_type_heizkostenabrechnung_edit;
  const initialValues = documentGroups.find((group) => group.id === itemID);
  const methods = useForm({
    resolver: zodResolver(addCostTypeDialogSchema),
    defaultValues: initialValues
      ? {
          allocation_key: initialValues.allocation_key ?? "Verbrauch",
          type: initialValues.type ?? "",
          name: initialValues.name ?? "",
          options: initialValues.options ?? [],
        }
      : defaultValues,
  });
  const router = useRouter();

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
    <DialogBase dialogName={"cost_type_heizkostenabrechnung_edit"}>
      <p className="font-bold text-lg text-admin_dark_text -mt-6">
        Neue Ausgabeart erstellen
      </p>
      <Form {...methods}>
        <form
          className="flex flex-col justify-between space-y-6 h-full"
          id="cost_type_create-dialog-form"
          onSubmit={methods.handleSubmit(async (data) => {
            try {
              await editCostType(data, "heizkostenabrechnung", itemID ?? "");
              toast.success("Ausgabe wurde hinzugefügt.");
              methods.reset(defaultValues);
              router.refresh();
              closeDialog("cost_type_heizkostenabrechnung_edit");
            } catch {
              toast.error("Fehler beim Speichern.");
            }
          })}
        >
          <FormInputField<AddCostTypeDialogFormValues>
            control={methods.control}
            name="name"
            label="	Name*"
            placeholder=""
          />
          <FormTagsInput<AddCostTypeDialogFormValues>
            name="options"
            control={methods.control}
          />
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
              className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300"
              onClick={() => {
                methods.reset(defaultValues);
                closeDialog("cost_type_heizkostenabrechnung_edit");
              }}
            >
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
