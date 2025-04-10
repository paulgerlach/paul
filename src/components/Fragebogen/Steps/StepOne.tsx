"use client";

import { type BaseStepProps } from "../StepWrapper";

export default function FragebogenStepOne({
	register,
	watch,
	setValue,
}: BaseStepProps) {
	const stepValue = watch("appartment_number");

	return (
		<div data-step="1" className="questionare-step mb-10 max-w-xl">
			<p className="mb-6 text-[40px] max-small:text-2xl text-dark_text">
				Anzahl der Wohnungen
			</p>
			<p className="mb-12 text-xl max-small:text-base text-dark_text">
				Wählen Sie aus, wie viele Wohnungen <br /> Sie aktuell betreuen und bei
				denen die Umrüstung auf Funkzähler erfolgen soll?
			</p>
			<div className="flex items-center justify-start gap-4">
				<button
					onClick={() =>
						setValue("appartment_number", Math.max(stepValue - 1, 1))
					}
					className="text-lg cursor-pointer text-dark_text size-12 rounded-full bg-dark_green/5 flex items-center justify-center -mt-10"
					type="button"
				>
					-
				</button>
				<div className="flex flex-col gap-1.5 items-center justify-center">
					<input
						className="border border-dark_green/20 rounded-base max-w-[200px] w-full duration-300 outline-none focus:ring-4 focus:ring-green/40 text-center text-lg text-dark_text py-6"
						type="number"
						min="1"
						value={stepValue}
						{...register("appartment_number", { valueAsNumber: true })}
					/>
					<label className="text-lg text-dark_text" htmlFor="appartment_number">
						Wohnungen
					</label>
				</div>
				<button
					onClick={() => setValue("appartment_number", stepValue + 1)}
					className="text-lg cursor-pointer text-dark_text size-12 rounded-full bg-dark_green/5 flex items-center justify-center -mt-10"
					type="button"
				>
					+
				</button>
			</div>
		</div>
	);
}
