"use client";

import { LazyLottie } from "@/components/Lottie/LazyLottie";
import { checkmark_icon_big, chevron, counter, info } from "@/static/icons";
import animation5 from "@/animations/Animation_5.json";
import animation6 from "@/animations/Animation_6.json";
import Image from "next/image";
import { Fragment, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import StepWrapper from "@/components/Fragebogen/StepWrapper";
import { useQuestionareStore } from "@/store/useQuestionareStore";
import StepInfo from "@/components/Fragebogen/StepInfo";

const formSchema = z.object({
  // Step 1: Property count category (determines flow)
  property_count_category: z
    .enum([
      "1-50 Immobilien",
      "51-800 Immobilien",
      "über 800 Immobilien",
    ])
    .nullable(),
  
  // Over50 Flow (51-800 & über 800 Immobilien) fields
  messdienstleister_count: z.number().min(1).optional(),
  zusammenarbeit_status: z
    .enum(["Sehr zufrieden", "Teils / teils", "Stark unzufrieden"])
    .nullable()
    .optional(),
  akuter_handlungsbedarf: z
    .enum(["Ja", "Nein"])
    .nullable()
    .optional(),
  
  // Under50 Flow (1-50 Immobilien) fields
  wohnungen_count: z.number().min(1).optional(),
  funkzaehler_status: z
    .enum(["Ja", "Nein"])
    .nullable()
    .optional(),
  standort_schwerpunkt: z.string().optional().or(z.literal("")),
  
  // Contact form fields (Q5 - Location)
  verwaltung_name: z.string().optional().or(z.literal("")),
  postleitzahl: z.string().optional().or(z.literal("")),
  ort: z.string().optional().or(z.literal("")),
  
  // Contact form fields (Q6 - Personal)
  email: z.string().email("Ungültige E-Mail-Adresse").or(z.literal("")),
  first_name: z.string().min(1, "Vorname ist erforderlich").or(z.literal("")),
  last_name: z.string().min(1, "Nachname ist erforderlich").or(z.literal("")),
  form_confirm: z.boolean().refine((val) => val === true, {
    message: "Bitte akzeptieren Sie die Datenschutzbestimmungen",
  }),
  // Legacy fields (kept for backwards compatibility, will be removed after full migration)
  appartment_number: z.number().min(1, "Wohnungsnummer ist erforderlich").optional(),
  heating_costs: z
    .enum([
      "Durch mich persönlich",
      "Durch einen anderen Messdienstleister",
      "Bisher noch gar nicht",
    ])
    .nullable()
    .optional(),
  heating_available: z
    .enum(["Ja", "Nein"])
    .nullable()
    .optional(),
  central_water_supply: z
    .enum(["Ja", "Nein"])
    .nullable()
    .optional(),
  central_heating_system: z
    .enum([
      "Nur Heizkörper",
      "Nur Fußbodenheizung",
      "Heizkörper und Fußbodenheizung",
    ])
    .nullable()
    .optional(),
  energy_sources: z
    .string()
    .nullable()
    .optional(),
});

export type QuestionareFormData = z.infer<typeof formSchema>;

export default function FragebogenPage() {
  const {
    activeStep,
    totalSteps,
    handleNextStep,
    handlePrevStep,
    totalStepsNumber,
    resetQuestionnaire,
  } = useQuestionareStore();

  // Reset questionnaire state when page mounts
  useEffect(() => {
    resetQuestionnaire();
  }, [resetQuestionnaire]);

  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [step0Error, setStep0Error] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      property_count_category: null,
      // Over50 Flow fields
      messdienstleister_count: 10,
      zusammenarbeit_status: null,
      akuter_handlungsbedarf: null,
      // Under50 Flow fields
      wohnungen_count: 3,
      funkzaehler_status: null,
      standort_schwerpunkt: "",
      // Contact form fields (Q5 - Location)
      verwaltung_name: "",
      postleitzahl: "",
      ort: "",
      // Contact form fields (Q6 - Personal)
      email: "",
      first_name: "",
      last_name: "",
      form_confirm: false,
      // Legacy fields
      appartment_number: 2,
      heating_costs: null,
      heating_available: null,
      central_water_supply: null,
      central_heating_system: null,
      energy_sources: "Fernwärme",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QuestionareFormData) => {
      const response = await fetch("/api/fragebogen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Senden der Nachricht");
      }

      return response;
    },
    onSuccess: () => {
      setIsSubmited(true);
      reset();
    },
  });

  return (
    <main id="content" className="pt-8 pb-24 px-5">
      {isSubmited ? (
        <div
          id="questionare-final"
          className="max-w-6xl px-10 max-small:px-5 flex flex-col items-start justify-end mx-auto"
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="size-[50px] block mb-6"
            src={checkmark_icon_big}
            alt="checkmark"
          />
          <h1 className="text-[40px] max-small:text-2xl mb-4 text-dark_text">
            Anfrage erfolgreich versendet
          </h1>
          <p className="text-dark_text text-xl max-large:mb-16 max-medium:mb-8 mb-24">
            Wir werden uns in den nächsten 24h bei Ihnen mit einem <br />
            für Sie zugeschnitten Angebot melden.
          </p>
          <div className="grid gap-8 max-medium:grid-cols-1 grid-cols-10">
            <div className="col-span-6 max-medium:col-span-1 space-y-5">
              <p className="bg-dark_green/5 rounded-base text-dark_text text-base py-8 px-6">
                Um eine reibungslose und effiziente Bearbeitung Ihrer Anfrage zu
                gewährleisten, benötigen wir Ihre persönlichen Daten. Diese
                ermöglichen es uns, bei eventuellen Rückfragen direkt mit Ihnen
                in Kontakt zu treten
              </p>
              <div className="grid gap-5 max-medium:grid-cols-1 grid-cols-2">
                <LazyLottie
                  animationName="Animation_5"
                  id="questionare-final-animation1"
                  wrapperClassName="relative"
                />

                <LazyLottie
                  animationName="Animation_6"
                  id="questionare-final-animation2"
                  wrapperClassName="relative"
                />
              </div>
            </div>
            <div className="col-span-4 max-medium:col-span-1 bg-dark_green/5 rounded-t-base px-10 pt-9">
              <p className="flex items-center text-dark_text justify-start gap-4 text-2xl font-bold mb-14">
                <button>
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    src={info}
                    alt="info"
                  />
                </button>
                Kostenfreie Installation
              </p>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="mx-auto"
                src={counter}
                alt="counter"
              />
            </div>
          </div>
        </div>
      ) : (
        <Fragment>
          <div
            data-filled-steps="0"
            className="steps-progress max-w-6xl mx-auto flex mb-10 items-center justify-start gap-1.5"
          >
            {totalSteps.map((step) => (
              <span
                key={step}
                data-step-index={step}
                className={`w-[50px] h-[1px] ${
                  step <= activeStep ? "bg-green" : "bg-dark_green/10"
                }`}
              ></span>
            ))}
            <span className="text-xs text-dark_text/20"> noch 4 min </span>
          </div>
          <div className="questionare-steps max-w-6xl mx-auto flex items-start max-large:flex-col max-large:gap-10 justify-between">
            <form
              onSubmit={handleSubmit((data) => mutation.mutate(data))}
              id="questionare-form"
              className="steps-wrapper"
            >
              {activeStep > 0 && (
                <button
                  className="text-[15px] cursor-pointer group text-dark_text/20 font-bold flex items-center justify-start gap-3"
                  id="prev-step"
                  onClick={() => handlePrevStep()}
                  type="button"
                >
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    alt="chevron"
                    src={chevron}
                    className="rotate-180 group-hover:-translate-x-1/2 duration-300 size-2.5 colored-to-black opacity-50"
                  />
                  zurück
                </button>
              )}
              {/*  */}
              <StepWrapper
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                activeStep={activeStep}
              />
              {/*  */}
              {/* Error message for step 0 */}
              {step0Error && activeStep === 0 && (
                <p className="text-red-500 text-sm mb-4">
                  Bitte wählen Sie eine Option aus, um fortzufahren.
                </p>
              )}
              <div className="flex items-center justify-start gap-5">
                {(() => {
                  const propertyCategory = watch("property_count_category");
                  const isUnder50Flow = propertyCategory === "1-50 Immobilien";
                  // Under50 flow submits on step 4, Over50 flow submits on step 5
                  const isSubmitStep = isUnder50Flow ? activeStep === 4 : activeStep === 5;
                  
                  const handleClick = () => {
                    // Validate step 0 - property count is required
                    if (activeStep === 0 && !propertyCategory) {
                      setStep0Error(true);
                      return;
                    }
                    setStep0Error(false);
                    handleNextStep();
                  };
                  
                  return (
                    <button
                      id="next-step"
                      className="rounded-xl cursor-pointer bg-green flex items-center justify-center duration-300 hover:opacity-80 text-white font-bold text-[15px] disabled:opacity-50 py-4 px-8 border border-transparent"
                      onClick={isSubmitStep ? undefined : handleClick}
                      type={isSubmitStep ? "submit" : "button"}
                      disabled={isSubmitStep && mutation.isPending}
                    >
                      {isSubmitStep && mutation.isPending ? "Wird gesendet..." : "Bestätigen"}
                    </button>
                  );
                })()}
                {(() => {
                  const propertyCategory = watch("property_count_category");
                  const isUnder50Flow = propertyCategory === "1-50 Immobilien";
                  // Under50 = 4 steps, Over50 = 5 steps
                  const lastStep = isUnder50Flow ? 4 : 5;
                  // Hide skip button on step 0 (required) and last step
                  if (activeStep === 0 || activeStep === lastStep) return null;
                  
                  return (
                    <button
                      id="skip-step"
                      className="cursor-pointer bg-transparent flex items-center justify-center duration-300 hover:opacity-80 disabled:opacity-50 text-green font-bold text-[15px] py-4 px-4"
                      onClick={() => handleNextStep()}
                      type="button"
                    >
                      Überspringen
                    </button>
                  );
                })()}
              </div>
            </form>
            <StepInfo activeStep={activeStep} />
          </div>
        </Fragment>
      )}
    </main>
  );
}
