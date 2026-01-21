"use client";

import { type BaseStepProps } from "../../StepWrapper";

export default function StepFourUnder50({
	register,
	errors,
}: BaseStepProps) {
	return (
		<div data-step="4" className="questionare-step mb-10 max-w-xl">
			<p className="mb-6 text-[40px] leading-tight max-small:text-2xl text-dark_text">
				Standortschwerpunkt
			</p>
			<p className="mb-12 text-[20px] max-small:text-base text-dark_text">
				In welcher Stadt befindet sich der Großteil Ihrer{" "}
				<span className="max-small:hidden"><br /></span>
				Immobilien?
			</p>
			<div className="space-y-4">
				<label htmlFor="standort_schwerpunkt" className="block">
					<input
						className="border border-dark_green/20 w-full max-w-[509px] rounded-xl py-4 px-5 duration-300 outline-none focus:ring-4 focus:ring-green/40 text-[16px]"
						placeholder="Ort oder Postleitzahl*"
						type="text"
						{...register("standort_schwerpunkt")}
						id="standort_schwerpunkt"
					/>
					{errors.standort_schwerpunkt && (
						<p className="text-red-500 text-sm mt-1">{errors.standort_schwerpunkt.message}</p>
					)}
				</label>
			</div>
		</div>
	);
}

