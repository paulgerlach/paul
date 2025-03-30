import { no_icon, yes_icon } from "@/static/icons";
import Image from "next/image";
import { type BaseStepProps } from "../StepWrapper";
import type { StepOptionType } from "@/types";
import { useQuestionareStore } from "@/store/useQuestionareStore";
import { type QuestionareFormData } from "@/app/(service)/fragebogen/page";

const options: StepOptionType<"central_water_supply">[] = [
  { id: "central_water_supply_yes", value: "Ja", icon: yes_icon },
  { id: "central_water_supply_no", value: "Nein", icon: no_icon },
];

export default function FragebogenStepFour({
  register,
  watch,
  setValue,
}: BaseStepProps) {
  const { activeStep, setActiveStep } = useQuestionareStore();
  const selectedValue = watch("central_water_supply");

  const onChangeForward = (name: keyof QuestionareFormData, value: string) => {
    setValue(name, value);
    setTimeout(() => {
      setActiveStep(activeStep + 1);
    }, 300);
  };
  return (
    <div data-step="4" className="questionare-step mb-10">
      <p className="mb-6 text-[40px] max-small:text-2xl text-dark_text">
        Zentrale Wasserversorgung
      </p>
      <p className="mb-12 text-xl max-small:text-base text-dark_text">
        Erfolgt die Warmwasserversorgung zentral?
      </p>
      <div className="space-y-3">
        {options.map((option: StepOptionType<"central_water_supply">) => (
          <label
            onClick={() =>
              onChangeForward("central_water_supply", option.value as string)
            }
            key={option.id}
            htmlFor={option.id}
            className="block">
            <input
              className="hidden peer"
              {...register("central_water_supply")}
              id={option.id}
              type="radio"
              checked={selectedValue === option.value}
              onChange={(e) =>
                onChangeForward("central_water_supply", e.target.value)
              }
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
