"use client";

import { big_x_icon, person_icon, settings_icon } from "@/static/icons";
import Image from "next/image";
import { type BaseStepProps } from "../StepWrapper";
import { useQuestionareStore } from "@/store/useQuestionareStore";
import { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import type { StepOptionType } from "@/types";

const options: StepOptionType<"heating_costs">[] = [
  { id: "bill_1", value: "Durch mich persönlich", icon: person_icon },
  {
    id: "bill_2",
    value: "Durch einen anderen Messdienstleister",
    icon: settings_icon,
  },
  { id: "bill_3", value: "Bisher noch gar nicht", icon: big_x_icon },
];

export default function FragebogenStepTwo({
  register,
  watch,
  setValue,
}: BaseStepProps) {
  const { activeStep, setActiveStep } = useQuestionareStore();
  const selectedValue = watch("heating_costs");

  const onChangeForward = (name: keyof QuestionareFormData, value: string) => {
    setValue(name, value);
    setTimeout(() => {
      setActiveStep(activeStep + 1);
    }, 300);
  };

  return (
    <div data-step="2" className="questionare-step mb-10">
      <p className="mb-6 text-[40px] max-small:text-2xl text-dark_text">
        Abrechnung der Heizkosten
      </p>
      <p className="mb-12 text-xl max-small:text-base text-dark_text">
        Wie werden die Heizkosten für diese Wohngebäude <br />
        aktuell abgerechnet?
      </p>
      <div className="space-y-3">
        {options.map((option: StepOptionType<"heating_costs">) => (
          <label
            onClick={() =>
              onChangeForward("heating_costs", option.value as string)
            }
            key={option.id}
            htmlFor={option.id}
            className="block">
            <input
              className="hidden peer"
              {...register("heating_costs")}
              id={option.id}
              type="radio"
              checked={selectedValue === option.value}
              onChange={(e) => onChangeForward("heating_costs", e.target.value)}
              value={option.value as string}
            />
            <div className="peer-checked:border-green peer-checked:ring-4 peer-checked:ring-green/20 cursor-pointer duration-300 rounded-base border border-dark_green/20 py-1.5 px-2.5 flex items-center justify-start gap-5 text-lg text-dark_text">
              <Image
                width={64}
                height={64}
                loading="lazy"
                className="size-16"
                alt={option.value as string}
                src={option.icon}
              />
              {option.value}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
