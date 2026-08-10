"use client";

import { private_person_icon, group_icon, fund_icon } from "@/static/icons";
import Image from "next/image";
import { type BaseStepProps } from "../StepWrapper";
import { useQuestionareStore } from "@/store/useQuestionareStore";
import type { QuestionareFormData } from "@/app/(service)/fragebogen/page";
import type { StepOptionType } from "@/types";

// Property count category options
const options: StepOptionType<"customer_type">[] = [
	{
		id: "is_private",
		value: "Privatperson",
		icon: private_person_icon,
	},
	{
		id: "is_management",
		value: "Hausverwaltung",
		icon: group_icon,
	},
	{
		id: "is_asset_manager",
		value: "Assetmanager, Fonds & Bestandshalter",
		icon: fund_icon,
	},
];

export default function FragebogenStepZero({
	register,
	watch,
	setValue,
}: BaseStepProps) {
	const { activeStep, setActiveStep } = useQuestionareStore();
	const selectedValue = watch("customer_type");

	const onChangeForward = (name: keyof QuestionareFormData, value: string) => {
		setValue(name, value);
		setTimeout(() => {
			setActiveStep(activeStep + 1);
		}, 300);
	};

	return (
		<div data-step="1" className="questionare-step mb-10 max-w-xl">
			<p className="mb-6 text-[40px] leading-tight max-small:text-2xl text-dark_text">
				Kundentyp
			</p>
			<p className="mb-12 text-[20px] max-small:text-base text-dark_text">
				In welcher Funktion verwalten oder betreuen Sie{" "}
				<span className="max-small:hidden">
					<br />
				</span>
				Immobilien?
			</p>
			<div className="space-y-3">
				{options.map((option: StepOptionType<"customer_type">) => (
					<label
						onClick={() =>
							onChangeForward("customer_type", option.value as string)
						}
						key={option.id}
						htmlFor={option.id}
						className="block"
					>
						<input
							className="hidden peer"
							{...register("customer_type")}
							id={option.id}
							type="radio"
							checked={selectedValue === option.value}
							onChange={(e) => onChangeForward("customer_type", e.target.value)}
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
