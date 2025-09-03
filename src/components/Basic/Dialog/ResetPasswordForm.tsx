"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { ROUTE_DASHBOARD } from "@/routes/routes";
import { Form } from "@/components/Basic/ui/Form";
import { Button } from "@/components/Basic/ui/Button";
import FormInputField from "@/components/Admin/Forms/FormInputField";
import { usePasswordResetSession } from "@/hooks/usePasswordResetSession";

const ResetPasswordSchema = z.object({
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

// Helper function to translate Supabase error messages to German
function getPasswordUpdateErrorMessage(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    "Password should be at least 6 characters": "Passwort muss mindestens 6 Zeichen lang sein",
    "Invalid password": "Ungültiges Passwort",
    "Password is too weak": "Passwort ist zu schwach",
    "Password is too common": "Passwort ist zu einfach",
    "Password contains personal information": "Passwort enthält persönliche Informationen",
    "Password has been found in a data breach": "Passwort wurde in einem Datenleck gefunden",
    "New password should be different from the old password": "Neues Passwort muss sich vom alten Passwort unterscheiden",
    "User not found": "Benutzer nicht gefunden",
    "Invalid session": "Ungültige Sitzung",
    "Session expired": "Sitzung abgelaufen",
    "Too many requests": "Zu viele Anfragen. Bitte versuchen Sie es später erneut",
    "Network error": "Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung",
  };

  // Check for exact matches first
  if (errorMap[errorMessage]) {
    return errorMap[errorMessage];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Default fallback
  return "Fehler beim Aktualisieren des Passworts. Bitte versuchen Sie es erneut.";
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { isValidToken, isLoading } = usePasswordResetSession();
  
  const methods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!isValidToken) return;

    setIsSubmitting(true);
    setFormError(null); // Clear any previous errors
    
    try {
      const { password } = data;
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        // Show specific error message on the form
        const errorMessage = getPasswordUpdateErrorMessage(error.message);
        setFormError(errorMessage);
        console.error("Password update error:", error.message);
        return;
      }

      toast.success("Passwort erfolgreich aktualisiert");
      
      setTimeout(() => {
        router.push(ROUTE_DASHBOARD);
      }, 700);
    } catch (e) {
      console.error("Unexpected password update error:", e);
      setFormError("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Wird geladen...
        </h2>
        <p className="text-gray-600">
          Bitte warten Sie einen Moment.
        </p>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Link wird überprüft...
        </h2>
        <p className="text-gray-600">
          Bitte warten Sie, während wir Ihren Link überprüfen.
        </p>
      </div>
    );
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-darkest-text mb-2">
            Neues Passwort setzen
          </h2>
          <p className="text-lg text-light-text">
            Geben Sie Ihr neues Passwort ein
          </p>
        </div>

        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 font-medium">
                  {formError}
                </p>
              </div>
            </div>
          </div>
        )}

        <FormInputField<ResetPasswordFormData>
          control={methods.control}
          name="password"
          placeholder="Neues Passwort*"
          type="password"
        />

        <FormInputField<ResetPasswordFormData>
          control={methods.control}
          name="confirmPassword"
          placeholder="Passwort bestätigen*"
          type="password"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Wird aktualisiert..." : "Passwort aktualisieren"}
        </Button>
      </form>
    </Form>
  );
}
