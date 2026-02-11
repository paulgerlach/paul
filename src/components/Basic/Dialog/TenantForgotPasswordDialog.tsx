"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/Basic/ui/Form";
import { Button } from "@/components/Basic/ui/Button";
import FormInputField from "@/components/Admin/Forms/FormInputField";
import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../ui/DialogBase";
import { useState } from "react";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

export default function TenantForgotPasswordDialog() {
  const { openDialogByType, openDialog, closeDialog } = useDialogStore();
  const [success, setSuccess] = useState(false);

  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const { email } = data;
      
      const response = await fetch('/api/tenant/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
      } else {
        toast.error(result.error || "Anfrage fehlgeschlagen");
      }
    } catch (e) {
      console.error("Tenant forgot password error:", e);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    }
  };

  const handleClose = () => {
    setSuccess(false);
    methods.reset();
    closeDialog("tenantForgotPassword");
  };

  const handleBackToLogin = () => {
    setSuccess(false);
    methods.reset();
    closeDialog("tenantForgotPassword");
    openDialog("tenantLogin");
  };

  if (openDialogByType.tenantForgotPassword)
    return (
      <DialogBase dialogName="tenantForgotPassword">
        {success ? (
          <div className="max-w-xl w-full bg-white py-3 px-4 max-small:px-3 rounded max-small:max-w-[92%] mx-auto space-y-4 text-center">
            <div className="text-green text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-darkest-text">
              E-Mail gesendet
            </h2>
            <p className="text-light-text">
              Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir Ihnen einen Link zum Zurücksetzen des Passworts gesendet.
            </p>
            <p className="text-sm text-gray-500">
              Bitte überprüfen Sie auch Ihren Spam-Ordner.
            </p>
            <Button
              type="button"
              onClick={handleBackToLogin}
              className="
                mt-6 flex w-full mx-auto
                px-6 py-4
                min-h-16
                max-xl:min-h-14 max-xl:py-3
                text-base max-small:text-sm
                text-dark_green rounded-halfbase
                bg-green hover:opacity-80 transition
              "
            >
              Zurück zur Anmeldung
            </Button>
          </div>
        ) : (
          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              method="dialog"
              className="max-w-xl w-full bg-white py-3 px-4 max-small:px-3 rounded max-small:max-w-[92%] mx-auto space-y-3 max-small:space-y-3"
            >
              <h2 className="text-3xl max-small:text-2xl font-bold text-darkest-text">
                Passwort vergessen?
              </h2>
              <p className="text-lg max-small:text-[15px] leading-relaxed text-light-text mb-5 max-small:mb-4">
                Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen.
              </p>

              <FormInputField<ForgotPasswordFormData>
                control={methods.control}
                name="email"
                placeholder="E-Mail-Adresse*"
                type="email"
              />

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
                {methods.formState.isSubmitting ? "Wird gesendet..." : "Link senden"}
              </Button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-link cursor-pointer underline mx-auto text-base leading-[19.2px] flex items-center justify-center w-full"
              >
                ← Zurück zur Anmeldung
              </button>
            </form>
          </Form>
        )}
      </DialogBase>
    );
  
  return null;
}
