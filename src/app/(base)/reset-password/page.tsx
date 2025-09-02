"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
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

function ResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const searchParams = useSearchParams();
  const methods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkPasswordResetSession = async () => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Ungültiger oder abgelaufener Link");
      router.push("/");
      return;
    }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast.error("Ungültiger oder abgelaufener Link");
        router.push("/");
        return;
      }

      if (!session) {
        toast.error("Ungültiger oder abgelaufener Link");
        router.push("/");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Ungültiger oder abgelaufener Link");
        router.push("/");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (userError || !userData) {
        toast.error("Benutzer nicht gefunden");
        router.push("/");
        return;
      }

      setIsValidToken(true);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsValidToken(true);
        } else if (event === 'SIGNED_OUT' || !session) {
          toast.error("Ungültiger oder abgelaufener Link");
          router.push("/");
        } else if (event === 'SIGNED_IN' && session) {
          checkPasswordResetSession();
        }
      }
    );

    checkPasswordResetSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [router, searchParams]);
  
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white py-8 px-6 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Wird geladen...
            </h2>
            <p className="text-gray-600">
              Bitte warten Sie einen Moment.
            </p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
