"use client";

import { type BaseStepProps } from "../../StepWrapper";

export default function StepFiveOver50({
	register,
	errors,
}: BaseStepProps) {
	return (
		<div data-step="5" className="questionare-step mb-10 max-w-xl">
			<p className="mb-6 text-[40px] leading-tight max-small:text-2xl text-dark_text">
				Ihre Kontaktdaten
			</p>
			<p className="mb-12 text-[20px] max-small:text-base text-dark_text">
				In welcher Region befindet sich das Hauptgeschäftsfeld{" "}
				<span className="max-small:hidden"><br /></span>
				Ihrer Verwaltung?
			</p>
			<div className="space-y-4">
				<label htmlFor="verwaltung_name" className="block">
					<input
						className="border border-dark_green/20 w-full max-w-[509px] rounded-xl py-4 px-5 duration-300 outline-none focus:ring-4 focus:ring-green/40 text-[16px]"
						placeholder="Name der Verwaltung*"
						type="text"
						{...register("verwaltung_name")}
						id="verwaltung_name"
					/>
					{errors.verwaltung_name && (
						<p className="text-red-500 text-sm mt-1">{errors.verwaltung_name.message}</p>
					)}
				</label>
				<div className="flex max-small:flex-col gap-4 max-w-[509px]">
					<label htmlFor="postleitzahl" className="block flex-1">
						<input
							className="border border-dark_green/20 w-full rounded-xl py-4 px-5 duration-300 outline-none focus:ring-4 focus:ring-green/40 text-[16px]"
							placeholder="Postleitzahl*"
							type="text"
							{...register("postleitzahl")}
							id="postleitzahl"
						/>
						{errors.postleitzahl && (
							<p className="text-red-500 text-sm mt-1">{errors.postleitzahl.message}</p>
						)}
					</label>
					<label htmlFor="ort" className="block flex-1">
						<input
							className="border border-dark_green/20 w-full rounded-xl py-4 px-5 duration-300 outline-none focus:ring-4 focus:ring-green/40 text-[16px]"
							placeholder="Ort*"
							type="text"
							{...register("ort")}
							id="ort"
						/>
						{errors.ort && (
							<p className="text-red-500 text-sm mt-1">{errors.ort.message}</p>
						)}
					</label>
				</div>
			</div>
		</div>
	);
}


