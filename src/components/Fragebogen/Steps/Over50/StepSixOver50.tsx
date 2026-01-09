"use client";

import Link from "next/link";
import { type BaseStepProps } from "../../StepWrapper";
import { ROUTE_DATENSCHUTZHINWEISE } from "@/routes/routes";

export default function StepSixOver50({
	register,
	errors,
}: BaseStepProps) {
	return (
		<div id="questionareForm" data-step="6" className="questionare-step mb-10 max-w-xl">
			<p className="mb-6 text-[40px] leading-tight max-small:text-2xl text-dark_text">
				Ihre Kontaktdaten
			</p>
			<p className="mb-12 text-[20px] max-small:text-base text-dark_text">
				Geben Sie Ihre Kontaktdaten ein, sodass wir Ihnen ein für<br />
				Sie passendes Angebot zukommen lassen können.
			</p>
			<div className="space-y-4">
				<div className="flex gap-4 max-w-[509px]">
					<label htmlFor="first_name" className="block flex-1">
						<input
							className="border border-dark_green/20 w-full rounded-xl py-4 px-5 duration-300 outline-none focus:ring-4 focus:ring-green/40 text-[16px]"
							placeholder="Vorname*"
							type="text"
							{...register("first_name")}
							id="first_name"
						/>
						{errors.first_name && (
							<p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
						)}
					</label>
					<label htmlFor="last_name" className="block flex-1">
						<input
							className="border border-dark_green/20 w-full rounded-xl py-4 px-5 duration-300 outline-none focus:ring-4 focus:ring-green/40 text-[16px]"
							placeholder="Nachname*"
							type="text"
							{...register("last_name")}
							id="last_name"
						/>
						{errors.last_name && (
							<p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
						)}
					</label>
				</div>
				<label className="block max-w-[509px]" htmlFor="email">
					<input
						className="border border-dark_green/20 w-full rounded-xl py-4 px-5 duration-300 outline-none focus:ring-4 focus:ring-green/40 text-[16px]"
						{...register("email")}
						placeholder="Email Adresse*"
						type="email"
						id="email"
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
					)}
				</label>
				<label
					htmlFor="form_confirm"
					className="max-w-[509px] flex items-start justify-start gap-3 pt-2"
				>
					<input
						id="form_confirm"
						{...register("form_confirm", {
							required: "Bitte akzeptieren Sie die Datenschutzbestimmungen.",
						})}
						className="accent-green w-5 h-5 mt-0.5 cursor-pointer"
						type="checkbox"
					/>
					<span className="text-[15px] text-dark_text leading-snug">
						Hiermit habe ich die{" "}
						<Link
							className="text-[#6083CC] underline"
							href={ROUTE_DATENSCHUTZHINWEISE}
						>
							Datenschutzbestimmungen
						</Link>{" "}
						gelesen und akzeptiert
					</span>
				</label>
				{errors.form_confirm && (
					<p className="text-red-500 text-sm">{errors.form_confirm.message}</p>
				)}
			</div>
		</div>
	);
}

