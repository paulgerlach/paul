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
      const v2Url = process.env.HEIDI_V2_URL;

      // sign in via heidi-v2 public oRPC endpoint
      const response = await fetch(`${v2Url}/rpc/public/userSession/signIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { email, password } }),
        credentials: "include",
      });

      if (!response.ok) {
        toast.error("Login failed. Please check your credentials.");
        return;
      }

      const result = await response.json();
      const session = result.json;

      // 2. Set the client-side 'atx' cookie for heidi-v2
      const expiryDate = new Date(session.expires_at * 1000);
      let cookieDomain = "";
      const hostname = window.location.hostname;
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
        const parts = hostname.split(".");
        if (parts.length >= 2) {
          cookieDomain = `; domain=.${parts.slice(-2).join(".")}`;
        }
      }
      document.cookie = `atx=${session.access_token}; path=/; expires=${expiryDate.toUTCString()}${cookieDomain};`;

      toast.success("Login successful. Redirecting...");
      closeDialog("login");

      // 3. Redirect to heidi-v2 admin panel
      window.location.href = `${v2Url}/admin`;
    } catch (e) {
      console.error("Unexpected login error:", e);
      toast.error("An unexpected error occurred");
    }
  };

  if (openDialogByType.login)
    return (
      <DialogBase dialogName="login">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            method="dialog"
            className="max-w-xl w-full bg-white py-3 px-4 max-small:px-3 rounded max-small:max-w-[92%] mx-auto space-y-3 max-small:space-y-3"
          >
            <h2 className="text-3xl max-small:text-2xl font-bold text-darkest-text">
              Willkommen zurück
            </h2>
            {/* <p className="text-lg max-small:text-base text-light-text mb-5 max-small:mb-3">
              Wählen Sie einer der unten aufgeführten Optionen zum einloggen
            </p> */}
            <p className="text-lg max-small:text-[15px] leading-relaxed text-light-text mb-5 max-small:mb-4">
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
            <button
              type="button"
              onClick={() => {
                const v2Url = process.env.HEIDI_V2_URL;
                if (v2Url) {
                  window.location.href = v2Url;
                }
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
