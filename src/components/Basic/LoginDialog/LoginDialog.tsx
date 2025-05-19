"use client";

import { domus, immoware24, matera } from "@/static/icons";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ROUTE_DASHBOARD } from "@/routes/routes";
import { supabase } from "@/utils/supabase/client";
import { setCookie } from "nookies";

const LoginSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  password: z.string().min(6, "Passwort muss mindestens 6 Zeichen lang sein."),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginDialog() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;

    const { data: sessionData, error } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    if (error) {
      // Optionally show error to user
      console.error("Login failed:", error.message);
      return;
    }

    const { session, user } = sessionData;

    if (user) {
      // Check if user exists in public.users
      const { data: existingUser, error: userFetchError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser && !userFetchError) {
        // Insert a record into public.users
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          // You can optionally add defaults here, like:
          // first_name: "", last_name: ""
        });

        if (insertError) {
          console.error(
            "Failed to create public.users record:",
            insertError.message
          );
          return;
        }
      }
    }

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

      router.push(ROUTE_DASHBOARD);
    }
  };
  return (
    <dialog
      id="login-dialog"
      className="dialog w-screen min-w-screen h-screen flex items-center justify-center min-h-screen bg-black/20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="dialog"
        className="max-w-xl rounded bg-white py-14 px-16 space-y-4">
        <h2 className="font-bold text-darkest-text text-3xl">
          Willkommen zurück
        </h2>
        <p className="text-lg text-light-text mb-7">
          Wählen Sie eine der unten aufgeführten Optionen zum einloggen
        </p>
        {/* Email Field */}
        <label className="block">
          <input
            {...register("email")}
            className="w-full border border-dark_green/20 rounded-md py-5 px-7 duration-300 outline-none focus:ring-4 focus:ring-green/40"
            placeholder="E-Mail-Adresse*"
            type="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </label>

        {/* Password Field */}
        <label className="block">
          <input
            {...register("password")}
            className="w-full border border-dark_green/20 rounded-md py-5 px-7 duration-300 outline-none focus:ring-4 focus:ring-green/40"
            placeholder="Passwort*"
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </label>
        <div className="flex items-center justify-start gap-8 my-9">
          <span className="text-base whitespace-nowrap text-light-text">
            Weitere Wege
          </span>
          <span className="w-full block h-px bg-[#e7e7e7]" />
        </div>
        <div className="grid grid-cols-3 gap-5">
          <div className="rounded bg-base-bg flex items-center justify-center py-4 px-7">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="block mx-auto"
              src={domus}
              alt="domus"
            />
          </div>
          <div className="rounded bg-base-bg flex items-center justify-center py-4 px-7">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="block mx-auto"
              src={immoware24}
              alt="immoware24"
            />
          </div>
          <div className="rounded bg-base-bg flex items-center justify-center py-4 px-7">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="block mx-auto"
              src={matera}
              alt="matera"
            />
          </div>
        </div>
        <button
          className="flex items-center justify-center transition hover:opacity-80 text-dark_green text-center text-base cursor-pointer py-5 px-[104px] max-medium:w-full max-medium:text-center max-medium:px-0 w-fit rounded-halfbase bg-green mx-auto"
          type="submit">
          Log in
        </button>
      </form>
    </dialog>
  );
}
