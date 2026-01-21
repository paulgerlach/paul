"use client";

import { type BaseStepProps } from "../../StepWrapper";

export default function StepTwoOver50({
	register,
	watch,
	setValue,
}: BaseStepProps) {
	const stepValue = watch("messdienstleister_count") || 10;

	return (
		<div data-step="2" className="questionare-step mb-10 max-w-xl">
			<p className="mb-6 text-[40px] leading-tight max-small:text-2xl text-dark_text">
				Anzahl der Messdienstleister
			</p>
			<p className="mb-12 text-[20px] max-small:text-base text-dark_text">
				Bitte geben Sie an, mit wie vielen Messdienstleistern Sie derzeit{" "}
				<span className="max-small:hidden"><br /></span>
				zusammenarbeiten.
			</p>
			<div className="flex items-start justify-start gap-4">
				<button
					onClick={() =>
						setValue("messdienstleister_count", Math.max((stepValue as number) - 1, 1))
					}
					className="text-lg cursor-pointer text-dark_text size-12 rounded-full bg-dark_green/5 flex items-center justify-center mt-1"
					type="button"
				>
					-
				</button>
				<div className="flex flex-col gap-1.5 items-center justify-center">
					<input
						className="border border-dark_green/20 rounded-xl max-w-[160px] w-full duration-300 outline-none focus:ring-4 focus:ring-green/40 text-center text-lg text-dark_text py-4"
						type="number"
						min="1"
						value={stepValue}
						{...register("messdienstleister_count", { valueAsNumber: true })}
					/>
					<label className="text-base text-dark_text/60" htmlFor="messdienstleister_count">
						Messdienstleister
					</label>
				</div>
				<button
					onClick={() => setValue("messdienstleister_count", (stepValue as number) + 1)}
					className="text-lg cursor-pointer text-dark_text size-12 rounded-full bg-dark_green/5 flex items-center justify-center mt-1"
					type="button"
				>
					+
				</button>
			</div>
		</div>
	);
}

