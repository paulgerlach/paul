"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../../ui/DialogBase";
import { allocationKeys } from "@/types";
import { Button } from "../../ui/Button";
import { Form } from "../../ui/Form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputField from "@/components/Admin/Forms/FormInputField";
import FormSelectField from "@/components/Admin/Forms/FormSelectField";
import { toast } from "sonner";
import { useAutoSnakeCase } from "@/hooks/useAutoSnakeCase";
import { useRouter, useParams } from "next/navigation";
import { adminCreateCostType } from "@/actions/create/admin/adminCreateCostType";

const addCostTypeDialogSchema = z.object({
  type: z.string().min(1, "Pflichtfeld").nullable(),
  name: z.string().min(1, "Pflichtfeld").nullable(),
  allocation_key: z.enum(allocationKeys),
});

export type AddCostTypeDialogFormValues = z.infer<
  typeof addCostTypeDialogSchema
>;

const defaultValues: AddCostTypeDialogFormValues = {
  type: "",
  name: "",
  allocation_key: "Verbrauch",
};

export default function AdminAddHeizkostenabrechnungCostTypeDialog() {
  const { openDialogByType, closeDialog } = useDialogStore();
  const isOpen = openDialogByType.admin_cost_type_heizkostenabrechnung_create;
  const methods = useForm({
    resolver: zodResolver(addCostTypeDialogSchema),
    defaultValues,
  });
  const router = useRouter();
  const { user_id } = useParams();

  useAutoSnakeCase(methods, "name", "type");

  if (!isOpen) return null;

  return (
    <DialogBase dialogName={"admin_cost_type_heizkostenabrechnung_create"}>
      <p className="font-bold text-lg text-admin_dark_text -mt-6">
        Neue Ausgabeart erstellen
      </p>
      <Form {...methods}>
        <form
          className="flex flex-col justify-between space-y-6 h-full"
          id="admin_cost_type_create-dialog-form"
          onSubmit={methods.handleSubmit(async (data) => {
            try {
              await adminCreateCostType(
                data,
                "heizkostenabrechnung",
                String(user_id)
              );
              toast.success("Ausgabe wurde hinzugefügt.");
              methods.reset(defaultValues);
              router.refresh();
              closeDialog("admin_cost_type_heizkostenabrechnung_create");
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
              className="px-6 py-4 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm font-medium border border-black/20 cursor-pointer rounded-md bg-white text-admin_dark_text text-lg shadow-xs transition-all duration-300 hover:opacity-80"
              onClick={() => {
                methods.reset(defaultValues);
                closeDialog("admin_cost_type_heizkostenabrechnung_create");
              }}
            >
              Abbrechen
            </button>
            <Button type="submit" className="!font-medium">
              Speichern
            </Button>
          </div>
        </form>
      </Form>
    </DialogBase>
  );
}
