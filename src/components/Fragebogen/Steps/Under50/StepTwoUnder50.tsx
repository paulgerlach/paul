"use client";

import { type BaseStepProps } from "../../StepWrapper";

export default function StepTwoUnder50({
	register,
	watch,
	setValue,
}: BaseStepProps) {
	const stepValue = watch("wohnungen_count") ?? 3;

	return (
		<div data-step="2" className="questionare-step mb-10 max-w-xl">
			<p className="mb-6 text-[40px] leading-tight max-small:text-2xl text-dark_text">
				Anzahl der Wohnungen
			</p>
			<p className="mb-12 text-[20px] max-small:text-base text-dark_text">
				Wählen Sie aus, wie viele Wohnungen Sie aktuell{" "}
				<span className="max-small:hidden"><br /></span>
				betreuen und bei denen die Umrüstung auf Int. Systeme
			</p>
			<div className="flex items-start justify-start gap-4">
				<button
					onClick={() =>
						setValue("wohnungen_count", Math.max((stepValue ?? 1) - 1, 1))
					}
					className="text-lg cursor-pointer text-dark_text size-12 rounded-full bg-dark_green/5 flex items-center justify-center mt-2"
					type="button"
				>
					-
				</button>
				<div className="flex flex-col gap-1.5 items-center justify-center">
					<input
						className="border border-dark_green/20 rounded-xl max-w-[200px] w-full duration-300 outline-none focus:ring-4 focus:ring-green/40 text-center text-lg text-dark_text py-6"
						type="number"
						min="1"
						value={stepValue}
						{...register("wohnungen_count", { valueAsNumber: true })}
					/>
					<label className="text-lg text-dark_text" htmlFor="wohnungen_count">
						Wohnungen
					</label>
				</div>
				<button
					onClick={() => setValue("wohnungen_count", (stepValue ?? 1) + 1)}
					className="text-lg cursor-pointer text-dark_text size-12 rounded-full bg-dark_green/5 flex items-center justify-center mt-2"
					type="button"
				>
					+
				</button>
			</div>
		</div>
	);
}
