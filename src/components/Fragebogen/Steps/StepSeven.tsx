import Link from "next/link";
import { type BaseStepProps } from "../StepWrapper";
import { ROUTE_DATENSCHUTZHINWEISE } from "@/routes/routes";

export default function FragebogenStepSeven({
  register,
  errors,
}: BaseStepProps) {
  return (
    <div id="questionareForm" data-step="7" className="questionare-step mb-10">
      <p className="mb-6 text-[40px] max-small:text-2xl text-dark_text">
        Ihre Kontaktdaten
      </p>
      <p className="mb-12 text-xl max-small:text-base text-dark_text">
        Geben Sie Ihre Kontaktdaten ein, sodass wir Ihnen ein für <br />
        SIe passendes Angebot zukommen lassen können.
      </p>
      <div className="grid grid-cols-2 gap-6 mb-5">
        <label htmlFor="first_name">
          <input
            className="border border-dark_green/20 w-full rounded-base py-5 px-7 duration-300 outline-none focus:ring-4 focus:ring-green/40"
            required
            placeholder="Vorname*"
            type="text"
            {...register("first_name", {
              required: "Vorname ist erforderlich",
            })}
            name="first_name"
            id="first_name"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm">{errors.first_name.message}</p>
          )}
        </label>
        <label htmlFor="last_name">
          <input
            className="border border-dark_green/20 w-full rounded-base py-5 px-7 duration-300 outline-none focus:ring-4 focus:ring-green/40"
            required
            placeholder="Nachname*"
            type="text"
            {...register("last_name", {
              required: "Nachname ist erforderlich",
            })}
            name="last_name"
            id="last_name"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm">{errors.last_name.message}</p>
          )}
        </label>
      </div>
      <label className="block w-full mb-6" htmlFor="email">
        <input
          className="border border-dark_green/20 w-full rounded-base py-5 px-7 duration-300 outline-none focus:ring-4 focus:ring-green/40"
          required
          {...register("email", {
            required: "Email ist erforderlich",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ungültige Email-Adresse",
            },
          })}
          placeholder="Email Adresse*s"
          type="text"
          name="email"
          id="email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </label>
      <label
        htmlFor="form_confirm"
        className="w-full flex items-center justify-start gap-6">
        <input
          id="form_confirm"
          {...register("form_confirm", {
            required: "Bitte akzeptieren Sie die Datenschutzbestimmungen.",
          })}
          className="accent-green size-4"
          type="checkbox"
        />
        <span>
          Hiermit habe ich die
          <Link
            className="text-[#6083CC] inline-block mx-2 underline"
            href={ROUTE_DATENSCHUTZHINWEISE}>
            Datenschutzbestimmungen
          </Link>
          gelesen und akzeptiert
        </span>
        <br />
      </label>
      {errors.form_confirm && (
          <p className="text-red-500 text-sm">{errors.form_confirm.message}</p>
        )}
    </div>
  );
}
