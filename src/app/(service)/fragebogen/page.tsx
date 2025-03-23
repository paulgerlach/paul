"use client";

import { LazyLottie } from "@/components/Lottie/LazyLottie";
import { checkmark_icon_big, chevron, counter, info } from "@/static/icons";
import { animation5, animation6 } from "@/static/lottieAnimations";
import Image from "next/image";
import { Fragment, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { slideDown, slideUp } from "@/utils";
import StepWrapper from "@/components/Fragebogen/StepWrapper";
import { useQuestionareStore } from "@/store/useQuestionareStore";

const formSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").nullable(),
  first_name: z.string().min(1, "Vorname ist erforderlich").nullable(),
  last_name: z.string().min(1, "Nachname ist erforderlich").nullable(),
  appartment_number: z.number().min(1, "Wohnungsnummer ist erforderlich"),
  heating_costs: z
    .enum([
      "Durch mich persönlich",
      "Durch einen anderen Messdienstleister",
      "Bisher noch gar nicht",
    ])
    .refine((val) => !!val, {
      message: "Heizkosten müssen angegeben werden",
    })
    .nullable(),
  heating_available: z
    .enum(["Ja", "Nein"])
    .refine((val) => !!val, {
      message: "Angabe erforderlich",
    })
    .nullable(),
  central_water_supply: z
    .enum(["Ja", "Nein"])
    .refine((val) => !!val, {
      message: "Angabe erforderlich",
    })
    .nullable(),
  central_heating_system: z
    .enum([
      "Nur Heizkörper",
      "Nur Fußbodenheizung",
      "Heizkörper und Fußbodenheizung",
    ])
    .refine((val) => !!val, {
      message: "Angabe erforderlich",
    })
    .nullable(),
  energy_sources: z
    .string()
    .min(1, "Energiequelle ist erforderlich")
    .nullable(),
  form_confirm: z.boolean().refine((val) => val === true, {
    message: "Bitte akzeptieren Sie die Datenschutzbestimmungen",
  }),
});

export type QuestionareFormData = z.infer<typeof formSchema>;

export default function FragebogenPage() {
  const {
    activeStep,
    totalSteps,
    handleNextStep,
    handlePrevStep,
    totalStepsNumber,
  } = useQuestionareStore();
  const infoRef = useRef<HTMLDivElement>(null);
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [isInfoOpened, setIsInfoOpened] = useState<boolean>(false);
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
      appartment_number: 2,
      email: "",
      first_name: "",
      last_name: "",
      heating_costs: null,
      heating_available: null,
      central_water_supply: null,
      central_heating_system: null,
      energy_sources: "",
      form_confirm: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QuestionareFormData) => {
      const response = await fetch(
        "https://hook.eu2.make.com/jd0ux1knh1rvreg6jcto9egpfk5gw1s9",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            appartment_number: data.appartment_number,
            heating_costs: data.heating_costs,
            heating_available: data.heating_available,
            central_water_supply: data.central_water_supply,
            central_heating_system: data.central_heating_system,
            energy_sources: data.energy_sources,
          }),
        }
      );

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

  const handleInfoSlide = () => {
    if (isInfoOpened) {
      setIsInfoOpened(false);
      slideDown(infoRef.current);
    } else {
      setIsInfoOpened(true);
      slideUp(infoRef.current);
    }
  };

  return (
    <main id="content" className="pt-8 pb-24 px-5">
      {isSubmited ? (
        <div
          id="questionare-final"
          className="max-w-6xl px-10 max-small:px-5 flex flex-col items-start justify-end mx-auto">
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
                  animationData={animation5}
                  id="questionare-final-animation1"
                  wrapperClassName="relative"
                />

                <LazyLottie
                  animationData={animation6}
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
            className="steps-progress max-w-6xl mx-auto flex mb-10 items-center justify-start gap-1.5">
            {totalSteps.map((step) => (
              <span
                key={step}
                data-step-index={step}
                className={`w-[50px] h-[1px] ${step <= activeStep ? "bg-green" : "bg-dark_green/10"}`}></span>
            ))}
            <span className="text-xs text-dark_text/20"> noch 3 min </span>
          </div>
          <div className="questionare-steps max-w-6xl mx-auto flex items-start max-large:flex-col max-large:gap-10 justify-between">
            <form
              onSubmit={handleSubmit((data) => mutation.mutate(data))}
              id="questionare-form"
              className="steps-wrapper">
              {activeStep > 0 && (
                <button
                  className="text-[15px] cursor-pointer group text-dark_text/20 font-bold flex items-center justify-start gap-3"
                  id="prev-step"
                  onClick={() => handlePrevStep()}
                  type="button">
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
              <div className="flex items-center justify-start gap-5">
                <button
                  id="next-step"
                  className="rounded-base cursor-pointer bg-green flex items-center justify-center duration-300 hover:opacity-80 text-white font-bold text-[15px] disabled:opacity-50 py-4 px-7 border border-transparent"
                  onClick={() => handleNextStep()}
                  type={`${activeStep === 6 ? "submit" : "button"}`}>
                  Bestätigen
                </button>
                {activeStep !== totalStepsNumber - 1 && (
                  <button
                    id="skip-step"
                    className="rounded-base cursor-pointer bg-white flex items-center justify-center duration-300 hover:opacity-80 hover:border-green disabled:opacity-50 text-green font-bold text-[15px] py-4 px-7 border border-transparent"
                    onClick={() => handleNextStep()}
                    type="button">
                    Überspringen
                  </button>
                )}
              </div>
            </form>
            <div className="questionare-info max-w-[40%] max-large:max-w-full w-full max-medium:mr-0 mt-2 -mr-10">
              <div className="questionare-answer-item bg-dark_green/5 rounded-base">
                <div
                  onClick={() => handleInfoSlide()}
                  className={`questionare-answer-header p-4 cursor-pointer flex items-center justify-between ${isInfoOpened ? "opened" : ""}`}>
                  <p className="questionare-question text-dark_text/30 flex items-center justify-between gap-3">
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      loading="lazy"
                      src={info}
                      alt="info"
                    />{" "}
                    Erklärung
                  </p>
                  <div className="questionare-icon">
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      loading="lazy"
                      className="rotate-90 colored-to-black opacity-50 size-4"
                      src={chevron}
                      alt="chevron"
                    />
                  </div>
                </div>
                <div
                  ref={infoRef}
                  className="questionare-answer-content px-4 pb-4">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
                    autem commodi, deserunt dicta eius in inventore laudantium
                    molestiae odit possimus tempore, unde ut vel? Architecto
                    beatae explicabo ipsum quaerat repellendus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </main>
  );
}
