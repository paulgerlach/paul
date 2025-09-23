"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(3, "Name muss mindestens 3 Zeichen lang sein"),
  email: z.string().email("Bitte eine gültige E-Mail-Adresse eingeben"),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen enthalten"),
  infoChecked: z.literal(true, {
    errorMap: () => ({
      message: "Bitte akzeptieren Sie die Datenschutzbestimmungen",
    }),
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const [formMessage, setFormMessage] = useState({ text: "", type: "" });
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setFormMessage({
          text: "Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.",
          type: "error",
        });
        throw new Error("Fehler beim Senden der Nachricht");
      }

      setFormMessage({
        text: "Ihre Nachricht wurde erfolgreich gesendet!",
        type: "success",
      });
      reset();
      return response.json();
    },
  });
  return (
    <div className="pt-20 max-small:pt-8 px-[100px] max-large:px-20 max-medium:px-10 max-small:px-5">
      <h1 className="text-[45px] leading-[54px] mb-6 max-medium:text-2xl text-dark_text">
        Kontaktieren Sie uns
      </h1>
      <p className="text-lg text-dark_text mb-5">
        Unser Service Team bearbeitet Anfragen überlich innerhalb von 24 Stunden
        per Email.
      </p>
      {formMessage.text && (
        <p
          role="alert"
          className={`mb-4 text-sm font-semibold ${
            formMessage.type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {formMessage.text}
        </p>
      )}
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        id="contactForm"
        className="space-y-4"
      >
        <label className="block">
          <input
            {...register("name")}
            className="w-full border border-dark_green/20 rounded-md py-5 px-7 duration-300 outline-none focus:ring-4 focus:ring-green/40"
            placeholder="Vor- und Nachname*"
            type="text"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </label>
        <label className="block">
          <input
            {...register("email")}
            className="w-full border border-dark_green/20 rounded-md py-5 px-7 duration-300 outline-none focus:ring-4 focus:ring-green/40"
            placeholder="E-Mail*"
            type="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </label>
        <label className="block">
          <textarea
            {...register("message")}
            className="w-full border border-dark_green/20 rounded-md py-5 px-7 duration-300 outline-none focus:ring-4 focus:ring-green/40"
            placeholder="Nachricht*"
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message.message}</p>
          )}
        </label>
        <div className="flex items-center justify-start gap-7">
          <input
            {...register("infoChecked")}
            type="checkbox"
            className="accent-green size-[18px]"
          />
          <label htmlFor="infoChecked">
            Hiermit habe ich die{" "}
            <a href="#" className="text-green-600 underline">
              Datenschutzbestimmungen
            </a>{" "}
            gelesen und akzeptiert.
          </label>
        </div>
        {errors.infoChecked && (
          <p className="text-red-500 text-sm">{errors.infoChecked.message}</p>
        )}

        <button
          className="py-4 px-9 text-[15px] cursor-pointer duration-300 hover:opacity-80 font-bold text-white rounded-md bg-green"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Senden..." : "Bestätigen"}
        </button>
      </form>
    </div>
  );
}
