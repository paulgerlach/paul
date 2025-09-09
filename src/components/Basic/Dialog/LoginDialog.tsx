"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { ROUTE_DASHBOARD } from "@/routes/routes";
import { Form } from "@/components/Basic/ui/Form";
import { Button } from "@/components/Basic/ui/Button";
import FormInputField from "@/components/Admin/Forms/FormInputField";
import Image from "next/image";
import { domus, immoware24, matera } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../ui/DialogBase";

const LoginSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresseq  ein."),
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein."),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginDialog() {
  const router = useRouter();
  const { openDialogByType, openDialog, closeDialog } = useDialogStore();

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { email, password } = data;
      const { data: sessionData, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        toast.error("Login fehlgeschlagen");
        console.error("Login failed:", error.message);
        return;
      }

      const { session } = sessionData;

      if (session?.access_token && session.refresh_token) {
        setCookie(null, "sb-access-token", session.access_token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        });
        setCookie(null, "sb-refresh-token", session.refresh_token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        });

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("permission")
          .eq("id", session.user.id)
          .single();

        if (userError) {
          console.error("Failed to fetch user role:", userError.message);
          toast.error("Konnte Benutzerrolle nicht abrufen");
          return;
        }

        if (userData?.permission === "admin") {
          router.push("/admin");
        } else {
          router.push(ROUTE_DASHBOARD);
        }

        toast.success("Login erfolgreich");
        closeDialog("login");
      }
    } catch (e) {
      console.error("Unexpected login error:", e);
      toast.error("Ein unerwarteter Fehler ist aufgetreten");
    }
  };

  if (openDialogByType.login)
    return (
      <DialogBase dialogName="login">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            method="dialog"
            className="max-w-xl w-full bg-white py-3 px-4 rounded space-y-6"
          >
            <h2 className="text-3xl font-bold text-darkest-text">
              Willkommen zurück
            </h2>
            <p className="text-lg text-light-text mb-5">
              Wählen Sie einer der unten aufgeführten Optionen zum einloggen
            </p>

            <FormInputField<LoginFormData>
              control={methods.control}
              name="email"
              placeholder="E-Mail-Adresse*"
              type="email"
            />

            <FormInputField<LoginFormData>
              control={methods.control}
              name="password"
              placeholder="Passwort*"
              type="password"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  openDialog("forgotPassword");
                  closeDialog("login");
                }}
                className="text-sm text-link cursor-pointer underline hover:no-underline"
              >
                Passwort vergessen?
              </button>
            </div>

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
                  className="rounded bg-base-bg flex items-center justify-center py-4 px-7"
                >
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
              className="mt-6 flex w-full mx-auto px-[104px] max-xl:px-3.5 max-xl:py-4 text-base text-dark_green rounded-halfbase bg-green hover:opacity-80 transition"
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting ? "Einloggen..." : "Anmelden"}
            </Button>
            <button
              onClick={() => {
                openDialog("register");
                closeDialog("login");
              }}
              className="text-link cursor-pointer underline mx-auto text-base leading-[19.2px] flex items-center justify-start"
            >
              Jetzt registrieren
            </button>
          </form>
        </Form>
      </DialogBase>
    );
}
