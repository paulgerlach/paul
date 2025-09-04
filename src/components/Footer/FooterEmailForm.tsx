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
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Senden der E-Mail.");
  }
  return response.json();
};

export default function FooterEmailForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const mutation = useMutation({
    mutationFn: ({ email }: EmailFormValues) => sendEmail(email),
    onSuccess: () => {
      setSuccessMessage("Danke! Ihre E-Mail wurde gesendet.");
      reset();
    },
    onError: () => {
      setSuccessMessage("Fehler! Bitte versuchen Sie es erneut.");
    },
  });

  return (
    <div className="max-medium:w-full">
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="relative w-fit mb-4 mx-auto max-medium:w-full"
      >
        <label className="sr-only" htmlFor="footer_contact_email">
          Los gehts
        </label>
        <input
          {...register("email")}
          className="py-5 px-7 min-w-[500px] max-small:min-w-fit max-medium:w-full border border-border_base rounded-halfbase placeholder:text-dark_text/50 text-dark_text text-xl placeholder:text-xl placeholder:leading-6 leading-6 bg-white"
          placeholder="Wie lautet Ihre email?"
          type="email"
          id="footer_contact_email"
        />
        <button
          className="absolute max-medium:relative max-medium:right-0 max-medium:w-full py-4 px-8 whitespace-nowrap text-xl leading-6 bg-green rounded-halfbase flex duration-300 hover:opacity-80 items-center justify-center top-1.5 right-1.5 text-dark_text"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Senden..." : "Los gehts"}
        </button>
      </form>

      {/* ✅ Display validation errors */}
      {errors.email && (
        <p className="text-red-600 text-sm mt-2">{errors.email.message}</p>
      )}

      {/* ✅ Display success/error messages */}
      {successMessage && (
        <p
          className={`text-sm mt-2 ${
            successMessage.includes("Fehler")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {successMessage}
        </p>
      )}

      <p className="text-dark_text text-sm mt-4 leading-4">
        Bleiben Sie bei allen Themen auf dem aktuellsten Stand
      </p>
    </div>
  );
}
