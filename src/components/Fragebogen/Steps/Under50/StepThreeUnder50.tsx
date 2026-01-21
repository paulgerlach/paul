"use client";

import { yes_icon, no_icon } from "@/static/icons";
import Image from "next/image";
import { type BaseStepProps } from "../../StepWrapper";
import type { StepOptionType } from "@/types";
import { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import { useQuestionareStore } from "@/store/useQuestionareStore";

const options: StepOptionType<"funkzaehler_status">[] = [
	{ id: "funkzaehler_ja", value: "Ja", icon: yes_icon },
	{ id: "funkzaehler_nein", value: "Nein", icon: no_icon },
];

export default function StepThreeUnder50({
	register,
	watch,
	setValue,
}: BaseStepProps) {
	const { activeStep, setActiveStep } = useQuestionareStore();
	const selectedValue = watch("funkzaehler_status");

	const onChangeForward = (name: keyof QuestionareFormData, value: string) => {
		setValue(name, value);
		setTimeout(() => {
			setActiveStep(activeStep + 1);
		}, 300);
	};

	return (
		<div data-step="3" className="questionare-step mb-10 max-w-md">
			<p className="mb-6 text-[40px] leading-tight max-small:text-2xl text-dark_text">
				Funkzähler-Status
			</p>
			<p className="mb-12 text-[20px] max-small:text-base text-dark_text">
				Haben Sie Ihren Bestand bereits vollständig auf{" "}
				<span className="max-small:hidden"><br /></span>
				Funkzähler umgestellt?
			</p>
			<div className="space-y-3">
				{options.map((option: StepOptionType<"funkzaehler_status">) => (
					<label
						onClick={() => onChangeForward("funkzaehler_status", option.value as string)}
						key={option.id}
						htmlFor={option.id}
						className="block"
					>
						<input
							className="hidden peer"
							{...register("funkzaehler_status")}
							id={option.id}
							type="radio"
							checked={selectedValue === option.value}
							onChange={(e) => onChangeForward("funkzaehler_status", e.target.value)}
							value={option.value as string}
						/>
						<div className="peer-checked:border-green peer-checked:ring-4 peer-checked:ring-green/20 cursor-pointer duration-300 rounded-xl border border-dark_green/20 w-[509px] max-small:w-full h-[69px] max-small:h-auto max-small:py-4 px-4 flex items-center justify-start gap-5 max-small:gap-3 text-[18px] max-small:text-base text-dark_text">
							<div className="bg-gray-100 rounded-xl size-[50px] flex items-center justify-center">
								<Image
									width={40}
									height={40}
									loading="lazy"
									className="w-[40px] h-[40px] object-contain"
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

