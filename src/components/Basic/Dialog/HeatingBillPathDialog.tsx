"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../ui/DialogBase";
import Image from "next/image";
import {
	ai_starts,
	blue_corner_check,
	corner_green_check,
	green_check_single,
	manuell,
} from "@/static/icons";
import { Button } from "../ui/Button";

export default function HeatingBillPathDialog({
	path,
	setPath,
	setIsPathSubmited,
}: {
	path: "manuell" | "ai";
	setPath: (path: "manuell" | "ai") => void;
	setIsPathSubmited: (isPathSubmited: boolean) => void;
}) {
	const { openDialogByType, closeDialog } = useDialogStore();
	const isOpen = openDialogByType.heating_bill_path_create;

	const actionBtn =
		"h-12 px-8 max-xl:px-3.5 max-xl:text-sm max-medium:w-full rounded-lg flex items-center justify-center font-medium";

	if (isOpen)
		return (
			<DialogBase size={780} dialogName="heating_bill_path_create">
				<div className="py-6 max-medium:py-3">
					<h2 className="text-center mb-4 max-medium:mb-2 font-bold text-admin_dark_text text-lg max-medium:text-base">
						Neues Gebäude anlegen
					</h2>
					<p className="text-center text-admin_dark_text text-sm max-medium:text-xs">
						Mit einem neuen KI-gestützten Tool lassen sich komplette Objekte in
						nur wenigen Klicks digital übertragen - inklusive der vollständigen
						Mieterstrukturen, Einheiten- und Wohnungszuschnitte. Apartment- und
						Nutzungseigenschaften werden dabei automatisch erkannt, intelligent
						zugeordnet und strukturiert angelegt.
					</p>
				</div>
				<div className="grid grid-cols-2 max-medium:grid-cols-1 gap-6 max-medium:gap-4">
					<div className="h-full">
						<input
							className="sr-only peer"
							type="radio"
							name="heating_bill_type"
							id="objektauswahl"
							checked={path === "manuell"}
							onChange={() => setPath("manuell")}
						/>
						<label
							htmlFor="objektauswahl"
							className="h-full flex flex-col px-6 max-medium:px-4 pb-6 max-medium:pb-4 pt-11 max-medium:pt-6 rounded-xl border-[3px] border-transparent bg-white shadow-sm cursor-pointer transition-all duration-300 peer-checked:border-[3px] peer-checked:border-green space-y-2 relative peer-checked:[&_.cornerCheck]:block"
						>
							<div className="flex items-center justify-center flex-col gap-4 font-bold text-sm text-admin_dark_text">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="max-w-[36px] max-h-[36px]"
									src={manuell}
									alt="manuell"
								/>
								Manuelles anlegen
							</div>
							<ul className="space-y-2">
								<li className="flex items-start gap-2 text-sm text-admin_dark_text">
									<Image
										width={0}
										height={0}
										sizes="100vw"
										loading="lazy"
										className="max-w-[24px] max-h-[24px]"
										src={green_check_single}
										alt="green_check_single"
									/>
									Mieterlisten integrierbar
								</li>
								<li className="flex items-start gap-2 text-sm text-admin_dark_text">
									<Image
										width={0}
										height={0}
										sizes="100vw"
										loading="lazy"
										className="max-w-[24px] max-h-[24px]"
										src={green_check_single}
										alt="green_check_single"
									/>
									Apartmentstruktur
								</li>
								<li className="flex items-start gap-2 text-sm text-admin_dark_text">
									<Image
										width={0}
										height={0}
										sizes="100vw"
										loading="lazy"
										className="max-w-[24px] max-h-[24px]"
										src={green_check_single}
										alt="green_check_single"
									/>
									Übertragung von Objekt- und Apartment-strukturen
								</li>
							</ul>
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								className="max-w-[20px] max-h-[22px] absolute top-[-1px] right-[-1px] cornerCheck hidden"
								src={corner_green_check}
								alt="corner_green_check"
							/>
						</label>
					</div>
					<div className="h-full">
						<input
							className="sr-only peer"
							type="radio"
							name="heating_bill_type"
							id="ai"
							checked={path === "ai"}
							onChange={() => setPath("ai")}
						/>
						<label
							htmlFor="ai"
							className="h-full flex flex-col px-6 max-medium:px-4 pb-6 max-medium:pb-4 pt-11 max-medium:pt-6 rounded-xl border-[3px] border-transparent bg-white shadow-sm cursor-pointer transition-all duration-100 peer-checked:border-[3px] peer-checked:border-ai-blue space-y-2 relative peer-checked:[&_.cornerCheck]:block"
						>
							<div className="flex items-center justify-center flex-col gap-4 font-bold text-sm text-admin_dark_text">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="max-w-[50px] max-h-[50px]"
									src={ai_starts}
									alt="ai_starts"
								/>
								Automatisch anlegen
							</div>
							<ul className="space-y-2">
								<li className="flex items-start gap-2 text-sm text-admin_dark_text">
									<Image
										width={0}
										height={0}
										sizes="100vw"
										loading="lazy"
										className="max-w-[24px] max-h-[24px]"
										src={ai_starts}
										alt="ai_starts"
									/>
									Automatische Mieterstruktur
								</li>
								<li className="flex items-start gap-2 text-sm text-admin_dark_text">
									<Image
										width={0}
										height={0}
										sizes="100vw"
										loading="lazy"
										className="max-w-[24px] max-h-[24px]"
										src={ai_starts}
										alt="ai_starts"
									/>
									Objekt und Apartments werden automatisch angelegt
								</li>
								<li className="flex items-start gap-2 text-sm text-admin_dark_text">
									<Image
										width={0}
										height={0}
										sizes="100vw"
										loading="lazy"
										className="max-w-[24px] max-h-[24px]"
										src={ai_starts}
										alt="ai_starts"
									/>
									Energiemix wird übertragen
								</li>
							</ul>
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								className="max-w-[20px] max-h-[22px] absolute top-[-1px] right-[-1px] cornerCheck hidden"
								src={blue_corner_check}
								alt="blue_corner_check"
							/>
						</label>
					</div>
				</div>
				<div className="flex items-center justify-between max-medium:flex-col max-medium:gap-3">
					<button
						onClick={() => closeDialog("heating_bill_path_create")}
						className={`${actionBtn} border border-admin_dark_text/50 text-admin_dark_text bg-[#e0e0e0] hover:bg-[#d0d0d0] transition-colors duration-300 max-medium:order-2`}
					>
						Zurück
					</button>

					<Button
						onClick={() => {
							setIsPathSubmited(true);
							closeDialog("heating_bill_path_create");
						}}
						className={`${actionBtn} ${path === "manuell" ? "bg-green hover:bg-ai-blue/80" : "bg-ai-blue hover:bg-ai-blue/80"} max-medium:order-1`}
					>
						Loslegen
					</Button>
				</div>
			</DialogBase>
		);
}
