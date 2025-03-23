"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

const emailSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const sendEmail = async (email: string) => {
  const url = "https://hook.eu2.make.com/ru0qxqaoubwpbo4jx7b5xillvyjr65ew";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Senden der E-Mail.");
  }
  return response.json();
};

export default function Subscription() {
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  // ✅ TanStack Query mutation
  const mutation = useMutation({
    mutationFn: ({ email }: EmailFormValues) => sendEmail(email),
    onSuccess: () => {
      setMessage("Danke! Ihre E-Mail wurde gesendet.");
      reset();
    },
    onError: () => {
      setMessage("Fehler! Bitte versuchen Sie es erneut.");
    },
  });

  return (
    <div className="py-14 max-small:px-4">
      <h2 className="text-center max-w-4xl mx-auto text-[30px] leading-9 mb-5 text-dark_text relative">
        Zeit ist Geld. Sparen Sie beides.
      </h2>

      {/* ✅ Form with React Hook Form */}
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="relative w-fit mb-4 mx-auto max-medium:w-full">
        <label className="sr-only" htmlFor="contact_email">
          Los gehts
        </label>
        <input
          {...register("email")}
          className="py-5 px-7 min-w-[500px] max-small:min-w-fit border border-border_base rounded-halfbase placeholder:text-dark_text/50 text-dark_text text-xl placeholder:text-xl max-medium:w-full max-medium:text-center placeholder:leading-6 leading-6"
          placeholder="Wie lautet Ihre email?"
          type="email"
          id="contact_email"
        />
        <button
          className="absolute max-medium:relative max-medium:right-0 max-medium:w-full py-4 px-8 whitespace-nowrap text-xl leading-6 bg-green rounded-halfbase flex duration-300 hover:opacity-80 items-center justify-center top-1.5 right-1.5 text-dark_text"
          type="submit"
          disabled={mutation.isPending}>
          {mutation.isPending ? "Senden..." : "Los gehts"}
        </button>
      </form>

      {errors.email && (
        <p className="text-red-600 text-sm mt-2">{errors.email.message}</p>
      )}

      {message && (
        <p
          className={`text-sm mt-2 ${
            message.includes("Fehler") ? "text-red-600" : "text-green-600"
          }`}>
          {message}
        </p>
      )}

      <p className="text-center mx-auto text-sm leading-4 mb-5 text-dark_text relative">
        Keine persönlichen Informationen werden gespeichert
      </p>
    </div>
  );
}
