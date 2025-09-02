"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { Form } from "@/components/Basic/ui/Form";
import { Button } from "@/components/Basic/ui/Button";
import FormInputField from "@/components/Admin/Forms/FormInputField";
import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../ui/DialogBase";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordDialog() {
  const { openDialogByType, closeDialog } = useDialogStore();

  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const { email } = data;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error("Fehler beim Senden der E-Mail");
        console.error("Password reset error:", error.message);
        return;
      }

      toast.success("E-Mail zum Zurücksetzen des Passworts wurde gesendet");
      closeDialog("forgotPassword");
    } catch (e) {
      console.error("Unexpected password reset error:", e);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    }
  };

  if (openDialogByType.forgotPassword)
    return (
      <DialogBase dialogName="forgotPassword">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            method="dialog"
            className="max-w-xl w-full bg-white py-6 px-8 rounded space-y-6"
          >
            <h2 className="text-3xl font-bold text-darkest-text">
              Passwort vergessen?
            </h2>
            <p className="text-lg text-light-text mb-5">
              Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
            </p>

            <FormInputField<ForgotPasswordFormData>
              control={methods.control}
              name="email"
              placeholder="E-Mail-Adresse*"
              type="email"
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => closeDialog("forgotPassword")}
                className="flex-1 bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                E-Mail senden
              </Button>
            </div>
          </form>
        </Form>
      </DialogBase>
    );

  return null;
}
