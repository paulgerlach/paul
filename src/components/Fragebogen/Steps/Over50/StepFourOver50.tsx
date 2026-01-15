"use client";

import { yes_icon, no_icon } from "@/static/icons";
import Image from "next/image";
import { type BaseStepProps } from "../../StepWrapper";
import { useQuestionareStore } from "@/store/useQuestionareStore";
import type { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import type { StepOptionType } from "@/types";

// Yes/No options
const options: StepOptionType<"akuter_handlungsbedarf">[] = [
	{ 
		id: "handlungsbedarf_ja", 
		value: "Ja", 
		icon: yes_icon 
	},
	{ 
		id: "handlungsbedarf_nein", 
		value: "Nein", 
		icon: no_icon 
	},
];

export default function StepFourOver50({
	register,
	watch,
	setValue,
}: BaseStepProps) {
	const { activeStep, setActiveStep } = useQuestionareStore();
	const selectedValue = watch("akuter_handlungsbedarf");

	const onChangeForward = (name: keyof QuestionareFormData, value: string) => {
		setValue(name, value);
		setTimeout(() => {
			setActiveStep(activeStep + 1);
		}, 300);
	};

	return (
		<div data-step="4" className="questionare-step mb-10 max-w-xl">
			<p className="mb-6 text-[40px] leading-tight max-small:text-2xl text-dark_text">
				Akuter Handlungsbedarf
			</p>
			<p className="mb-12 text-[20px] max-small:text-base text-dark_text">
				Gibt es aktuell eine Immobilie mit akutem{" "}
				<span className="max-small:hidden"><br /></span>
				Handlungsbedarf?
			</p>
			<div className="space-y-3">
				{options.map((option: StepOptionType<"akuter_handlungsbedarf">) => (
					<label
						onClick={() =>
							onChangeForward("akuter_handlungsbedarf", option.value as string)
						}
						key={option.id}
						htmlFor={option.id}
						className="block"
					>
						<input
							className="hidden peer"
							{...register("akuter_handlungsbedarf")}
							id={option.id}
							type="radio"
							checked={selectedValue === option.value}
							onChange={(e) => onChangeForward("akuter_handlungsbedarf", e.target.value)}
							value={option.value as string}
						/>
						<div className="peer-checked:border-green peer-checked:ring-4 peer-checked:ring-green/20 cursor-pointer duration-300 rounded-xl border border-dark_green/20 w-[509px] max-small:w-full h-[69px] max-small:h-auto max-small:py-4 px-4 flex items-center justify-start gap-5 max-small:gap-3 text-[18px] max-small:text-base text-dark_text">
							<div className="bg-gray-100 rounded-xl w-[50px] h-[50px] flex items-center justify-center">
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


