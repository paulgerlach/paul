import { heater_form1, heater_form2, heater_form3 } from "@/static/icons";
import Image from "next/image";
import { type BaseStepProps } from "../StepWrapper";
import type { StepOptionType } from "@/types";
import { useQuestionareStore } from "@/store/useQuestionareStore";
import { type QuestionareFormData } from "@/app/(service)/fragebogen/page";

const options: StepOptionType<"central_heating_system">[] = [
  { id: "heater1", value: "Nur Heizkörper", icon: heater_form1 },
  { id: "heater2", value: "Nur Fußbodenheizung", icon: heater_form2 },
  {
    id: "heater3",
    value: "Heizkörper und Fußbodenheizung",
    icon: heater_form3,
  },
];

export default function FragebogenStepFive({
  register,
  watch,
  setValue,
}: BaseStepProps) {
  const { activeStep, setActiveStep } = useQuestionareStore();
  const selectedValue = watch("central_heating_system");

  const onChangeForward = (name: keyof QuestionareFormData, value: string) => {
    setValue(name, value);
    setTimeout(() => {
      setActiveStep(activeStep + 1);
    }, 300);
  };
  return (
    <div data-step="5" className="questionare-step mb-10">
      <p className="mb-6 text-[40px] max-small:text-2xl text-dark_text">
        Zentrale Heizanlage
      </p>
      <p className="mb-12 text-xl max-small:text-base text-dark_text">
        Wie wird in den Wohnungen geheizt?
      </p>
      <div className="space-y-3">
        {options.map((option: StepOptionType<"central_heating_system">) => (
          <label
            onClick={() =>
              onChangeForward("central_heating_system", option.value as string)
            }
            key={option.id}
            htmlFor={option.id}
            className="block">  
            <input
              className="hidden peer"
              {...register("central_heating_system")}
              id={option.id}
              type="radio"
              checked={selectedValue === option.value}
              onChange={(e) =>
                onChangeForward("central_heating_system", e.target.value)
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
