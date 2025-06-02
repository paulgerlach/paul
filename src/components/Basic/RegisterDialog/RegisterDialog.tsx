"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ROUTE_DASHBOARD } from "@/routes/routes";
import { supabase } from "@/utils/supabase/client";
import { setCookie } from "nookies";
import { Form } from "@/components/Basic/ui/Form";
import { Button } from "@/components/Basic/ui/Button";
import { toast } from "sonner";
import FormInputField from "@/components/Admin/Forms/FormInputField";
import Image from "next/image";
import { domus, immoware24, matera } from "@/static/icons";

const RegisterSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein."),
  first_name: z.string().min(1, "Vorname ist erforderlich."),
  last_name: z.string().min(1, "Nachname ist erforderlich."),
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

export default function RegisterDialog() {
  const router = useRouter();

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { email, password, first_name, last_name } = data;

    // Step 1: Sign up with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            first_name,
            last_name,
          },
        },
      }
    );

    if (signUpError || !signUpData.user) {
      console.error("Signup error:", signUpError?.message);
      toast.error("Registrierung fehlgeschlagen");
      return;
    }

    const session = signUpData.session;

    if (session?.access_token) {
      setCookie(null, "sb-access-token", session.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      setCookie(null, "sb-refresh-token", session.refresh_token ?? "", {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
    } else {
      toast.info("Bitte bestätigen Sie Ihre E-Mail-Adresse.");
    }

    toast.success("Registrierung erfolgreich!");
    router.push(ROUTE_DASHBOARD);
  };

  return (
    <dialog
      id="register-dialog"
      className="dialog w-screen h-screen flex items-center justify-center bg-black/20">
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          method="dialog"
          className="max-w-xl w-full bg-white py-14 px-16 rounded space-y-6">
          <h2 className="text-3xl font-bold text-darkest-text">
            Konto erstellen
          </h2>
          <p className="text-lg text-light-text mb-5">
            Füllen Sie die folgenden Felder aus, um ein Konto zu erstellen
          </p>

          <FormInputField<RegisterFormData>
            control={methods.control}
            name="first_name"
            placeholder="Vorname*"
            type="text"
          />

          <FormInputField<RegisterFormData>
            control={methods.control}
            name="last_name"
            placeholder="Nachname*"
            type="text"
          />

          <FormInputField<RegisterFormData>
            control={methods.control}
            name="email"
            placeholder="E-Mail-Adresse*"
            type="email"
          />

          <FormInputField<RegisterFormData>
            control={methods.control}
            name="password"
            placeholder="Passwort*"
            type="password"
          />

          <Button
            type="button"
            className="rounded bg-base-bg flex items-center justify-center py-4 px-7"
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: "slack",
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              });

              if (error) {
                toast.error("Slack Anmeldung fehlgeschlagen.");
                console.error("Slack login error:", error);
              }
            }}>
            Slack
          </Button>

          <div className="flex items-center justify-start gap-8 my-9">
            <span className="text-base text-light-text whitespace-nowrap">
              Weitere Wege
            </span>
            <span className="w-full block h-px bg-[#e7e7e7]" />
          </div>

          <div className="grid grid-cols-3 gap-5">
            {[domus, immoware24, matera].map((icon, idx) => (
              <div
                key={idx}
                className="rounded bg-base-bg flex items-center justify-center py-4 px-7">
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="block mx-auto"
                  src={icon}
                  alt={`login-option-${idx}`}
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="mt-6 flex w-fit mx-auto px-[104px] py-5 text-base text-dark_green rounded-halfbase bg-green hover:opacity-80 transition"
            disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting
              ? "Registrieren..."
              : "Registrieren"}
          </Button>
        </form>
      </Form>
    </dialog>
  );
}
