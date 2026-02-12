"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Form } from "@/components/Basic/ui/Form";
import { Button } from "@/components/Basic/ui/Button";
import FormInputField from "@/components/Admin/Forms/FormInputField";
import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../ui/DialogBase";

const TenantLoginSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  password: z.string().min(1, "Bitte geben Sie Ihr Passwort ein."),
});

type TenantLoginFormData = z.infer<typeof TenantLoginSchema>;

export default function TenantLoginDialog() {
  const router = useRouter();
  const { openDialogByType, openDialog, closeDialog } = useDialogStore();

  const methods = useForm<TenantLoginFormData>({
    resolver: zodResolver(TenantLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TenantLoginFormData) => {
    try {
      const { email, password } = data;
      
      const response = await fetch('/api/tenant/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Anmeldung erfolgreich");
        closeDialog("tenantLogin");
        router.push('/mieter/dashboard');
      } else {
        toast.error(result.error || "Anmeldung fehlgeschlagen");
      }
    } catch (e) {
      console.error("Tenant login error:", e);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    }
  };

  if (openDialogByType.tenantLogin)
    return (
      <DialogBase dialogName="tenantLogin">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            method="dialog"
            className="max-w-xl w-full bg-white py-3 px-4 max-small:px-3 rounded max-small:max-w-[92%] mx-auto space-y-3 max-small:space-y-3"
          >
            <h2 className="text-3xl max-small:text-2xl font-bold text-darkest-text">
              Mieter-Dashboard
            </h2>
            <p className="text-lg max-small:text-[15px] leading-relaxed text-light-text mb-5 max-small:mb-4">
              Melden Sie sich an, um Ihre Verbrauchsdaten einzusehen
            </p>

            <FormInputField<TenantLoginFormData>
              control={methods.control}
              name="email"
              placeholder="E-Mail-Adresse*"
              type="email"
            />

            <FormInputField<TenantLoginFormData>
              control={methods.control}
              name="password"
              placeholder="Passwort*"
              type="password"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  openDialog("tenantForgotPassword");
                  closeDialog("tenantLogin");
                }}
                className="text-sm text-link cursor-pointer underline hover:no-underline"
              >
                Passwort vergessen?
              </button>
            </div>

            <Button
              type="submit"
              className="
                mt-6 flex w-full mx-auto
                px-6 py-4
                min-h-16
                max-xl:min-h-14 max-xl:py-3
                text-base max-small:text-sm
                text-dark_green rounded-halfbase
                bg-green hover:opacity-80 transition
                focus:outline-none
                focus:ring-2 focus:ring-green/40
                focus:ring-offset-2
                active:ring-green/60
              "
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting ? "Einloggen..." : "Anmelden"}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Sie haben noch keinen Zugang? Wenden Sie sich an Ihren Vermieter.
            </p>
          </form>
        </Form>
      </DialogBase>
    );
  
  return null;
}
