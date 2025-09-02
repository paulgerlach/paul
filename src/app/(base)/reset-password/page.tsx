"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { ROUTE_DASHBOARD } from "@/routes/routes";
import { Form } from "@/components/Basic/ui/Form";
import { Button } from "@/components/Basic/ui/Button";
import FormInputField from "@/components/Admin/Forms/FormInputField";

const ResetPasswordSchema = z.object({
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  const methods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidToken(true);
      } else {
        toast.error("Ungültiger oder abgelaufener Link");
        router.push("/");
      }
    };

    checkSession();
  }, [router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!isValidToken) return;

    setIsLoading(true);
    try {
      const { password } = data;
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error("Fehler beim Aktualisieren des Passworts");
        console.error("Password update error:", error.message);
        return;
      }

      toast.success("Passwort erfolgreich aktualisiert");
      router.push(ROUTE_DASHBOARD);
    } catch (e) {
      console.error("Unexpected password update error:", e);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white py-8 px-6 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Link wird überprüft...
            </h2>
            <p className="text-gray-600">
              Bitte warten Sie, während wir Ihren Link überprüfen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white py-8 px-6 rounded-lg shadow-md">
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
              disabled={isLoading}
            >
              {isLoading ? "Wird aktualisiert..." : "Passwort aktualisieren"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
