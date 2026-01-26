"use client";

import { immobilien_1_50, immobilien_51_800, immobilien_over_800 } from "@/static/icons";
import Image from "next/image";
import { type BaseStepProps } from "../StepWrapper";
import { useQuestionareStore } from "@/store/useQuestionareStore";
import type { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import type { StepOptionType } from "@/types";

// Property count category options
const options: StepOptionType<"property_count_category">[] = [
	{ 
		id: "property_1_50", 
		value: "1-50 Immobilien", 
		icon: immobilien_1_50 
	},
	{ 
		id: "property_51_800", 
		value: "51-800 Immobilien", 
		icon: immobilien_51_800 
	},
	{ 
		id: "property_over_800", 
		value: "über 800 Immobilien", 
		icon: immobilien_over_800 
	},
];

export default function FragebogenStepOne({
	register,
	watch,
	setValue,
}: BaseStepProps) {
	const { activeStep, setActiveStep } = useQuestionareStore();
	const selectedValue = watch("property_count_category");

	const onChangeForward = (name: keyof QuestionareFormData, value: string) => {
		setValue(name, value);
		setTimeout(() => {
			setActiveStep(activeStep + 1);
		}, 300);
	};

	return (
		<div data-step="1" className="questionare-step mb-10 max-w-xl">
			<p className="mb-6 text-[40px] leading-tight max-small:text-2xl text-dark_text">
				Immobilienbestand
			</p>
			<p className="mb-12 text-[20px] max-small:text-base text-dark_text">
				Wie viele Wohn- und Gewerbeimmobilien verwalten Sie<br />
				aktuell insgesamt?
			</p>
			<div className="space-y-3">
				{options.map((option: StepOptionType<"property_count_category">) => (
					<label
						onClick={() =>
							onChangeForward("property_count_category", option.value as string)
						}
						key={option.id}
						htmlFor={option.id}
						className="block"
					>
						<input
							className="hidden peer"
							{...register("property_count_category")}
							id={option.id}
							type="radio"
							checked={selectedValue === option.value}
							onChange={(e) => onChangeForward("property_count_category", e.target.value)}
							value={option.value as string}
						/>
						<div className="peer-checked:border-green peer-checked:ring-4 peer-checked:ring-green/20 cursor-pointer duration-300 rounded-xl border border-dark_green/20 w-[509px] h-[69px] px-4 flex items-center justify-start gap-5 text-[18px] text-dark_text">
							<div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center">
								<Image
									width={25}
									height={25}
									loading="lazy"
									className="w-[25px] h-[25px] object-contain"
									alt={option.value as string}
									src={option.icon}
								/>
							</div>
							{option.value}
						</div>
					</label>
				))}
			</div>
		</div>
	);
}
