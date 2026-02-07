"use client";

import { zufrieden_check, teils_teils_scale, unzufrieden_x } from "@/static/icons";
import Image from "next/image";
import { type BaseStepProps } from "../../StepWrapper";
import { useQuestionareStore } from "@/store/useQuestionareStore";
import type { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import type { StepOptionType } from "@/types";

// Satisfaction options
const options: StepOptionType<"zusammenarbeit_status">[] = [
	{ 
		id: "zufrieden", 
		value: "Sehr zufrieden", 
		icon: zufrieden_check 
	},
	{ 
		id: "teils_teils", 
		value: "Teils / teils", 
		icon: teils_teils_scale 
	},
	{ 
		id: "unzufrieden", 
		value: "Stark unzufrieden", 
		icon: unzufrieden_x 
	},
];

export default function StepThreeOver50({
	register,
	watch,
	setValue,
}: BaseStepProps) {
	const { activeStep, setActiveStep } = useQuestionareStore();
	const selectedValue = watch("zusammenarbeit_status");

	const onChangeForward = (name: keyof QuestionareFormData, value: string) => {
		setValue(name, value);
		setTimeout(() => {
			setActiveStep(activeStep + 1);
		}, 300);
	};

	return (
		<div data-step="3" className="questionare-step mb-10 max-w-xl">
			<p className="mb-6 text-[40px] leading-tight max-small:text-2xl text-dark_text">
				Status der Zusammenarbeit
			</p>
			<p className="mb-12 text-[20px] max-small:text-base text-dark_text">
				Wie zufrieden sind Sie insgesamt mit der Zusammenarbeit{" "}
				<span className="max-small:hidden"><br /></span>
				mit den Messdienstleistern?
			</p>
			<div className="space-y-3">
				{options.map((option: StepOptionType<"zusammenarbeit_status">) => (
					<label
						onClick={() =>
							onChangeForward("zusammenarbeit_status", option.value as string)
						}
						key={option.id}
						htmlFor={option.id}
						className="block"
					>
						<input
							className="hidden peer"
							{...register("zusammenarbeit_status")}
							id={option.id}
							type="radio"
							checked={selectedValue === option.value}
							onChange={(e) => onChangeForward("zusammenarbeit_status", e.target.value)}
							value={option.value as string}
						/>
						<div className="peer-checked:border-green peer-checked:ring-4 peer-checked:ring-green/20 cursor-pointer duration-300 rounded-xl border border-dark_green/20 w-[509px] max-small:w-full h-[69px] max-small:h-auto max-small:py-4 px-4 flex items-center justify-start gap-5 max-small:gap-3 text-[18px] max-small:text-base text-dark_text">
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

