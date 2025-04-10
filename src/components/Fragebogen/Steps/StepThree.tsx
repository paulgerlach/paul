import { no_icon, yes_icon } from "@/static/icons";
import Image from "next/image";
import { type BaseStepProps } from "../StepWrapper";
import type { StepOptionType } from "@/types";
import { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import { useQuestionareStore } from "@/store/useQuestionareStore";

const options: StepOptionType<"heating_available">[] = [
	{ id: "heating_available_yes", value: "Ja", icon: yes_icon },
	{ id: "heating_available_no", value: "Nein", icon: no_icon },
];

export default function FragebogenStepThree({
	register,
	watch,
	setValue,
}: BaseStepProps) {
	const { activeStep, setActiveStep } = useQuestionareStore();
	const selectedValue = watch("heating_available");

	const onChangeForward = (name: keyof QuestionareFormData, value: string) => {
		setValue(name, value);
		setTimeout(() => {
			setActiveStep(activeStep + 1);
		}, 300);
	};
	return (
		<div data-step="3" className="questionare-step mb-10">
			<p className="mb-6 text-[40px] max-small:text-2xl text-dark_text">
				Zentralheizung vorhanden
			</p>
			<p className="mb-12 text-xl max-small:text-base text-dark_text">
				Ist das Wohngebäude mit einer Zentralheizung <br />
				ausgestattet?
			</p>
			<div className="space-y-3">
				{options.map((option: StepOptionType<"heating_available">) => (
					<label
						onClick={() =>
							onChangeForward("heating_available", option.value as string)
						}
						key={option.id}
						htmlFor={option.id}
						className="block"
					>
						<input
							className="hidden peer"
							{...register("heating_available")}
							id={option.id}
							type="radio"
							checked={selectedValue === option.value}
							onChange={(e) =>
								onChangeForward("heating_available", e.target.value)
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
