import { ROUTE_FRAGEBOGEN } from "@/routes/routes";
import {
	checkmark_shield,
	chess_shield,
	eu_elipse,
	lock,
	small_counter,
} from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default function Kostenfrei() {
	return (
		<div className="px-20 max-large:px-16 max-medium:px-10 max-small:px-5 my-16 max-small:my-8">
			<h5 className="text-[45px] text-center leading-[54px] mb-9 max-medium:text-2xl text-dark_text">
				Kostenfrei nachrüsten
			</h5>
			<Link
				className="flex items-center mx-auto justify-center transition hover:opacity-80 text-white text-center text-lg cursor-pointer py-5 px-[104px] max-medium:w-full max-medium:text-center max-medium:px-0 w-fit rounded-halfbase bg-green"
				href={ROUTE_FRAGEBOGEN}
			>
				Jetzt installieren lassen
			</Link>
			<p className="text-center text-dark_text text-[15px]">
				Kostenfreie Installation der Funkgeräte
			</p>
			<div className="flex mb-28 max-medium:my-10 mt-16 items-center justify-center gap-24 max-large:gap-16 max-medium:gap-10 max-small:gap-5 max-large:grid max-large:grid-cols-2 max-medium:grid-cols-1">
				<div className="flex items-center justify-start max-medium:justify-center gap-5 max-small:justify-start">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						src={chess_shield}
						alt="chess_shield"
					/>
					<div>
						<p className="text-dark_text text-[15px]">Gesetzeskonform</p>
						<p className="text-dark_text/50 text-[15px]">§ 229 Artikel 3</p>
					</div>
				</div>
				<div className="flex items-center justify-start max-medium:justify-center gap-5 max-small:justify-start">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						src={checkmark_shield}
						alt="checkmark_shield"
					/>
					<div>
						<p className="text-dark_text text-[15px]">Datenschutzkonform</p>
						<p className="text-dark_text/50 text-[15px]">Nach DSGVO</p>
					</div>
				</div>
				<div className="flex items-center justify-start max-medium:justify-center gap-5 max-small:justify-start">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						src={lock}
						alt="lock"
					/>
					<div>
						<p className="text-dark_text text-[15px]">SSL Verschlüsselung</p>
						<p className="text-dark_text/50 text-[15px]">
							Zertifiziert und Sicher
						</p>
					</div>
				</div>
				<div className="flex items-center justify-start max-medium:justify-center gap-5 max-small:justify-start">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						src={eu_elipse}
						alt="eu_elipse"
					/>
					<div>
						<p className="text-dark_text text-[15px]">Server in Europa</p>
						<p className="text-dark_text/50 text-[15px]">EU Datenschutz</p>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between px-9 max-small:px-5 max-megalarge:flex-col max-megalarge:space-y-6 py-7 border border-dark_green/10 rounded-base">
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					src={small_counter}
					alt="small_counter"
				/>
				<p className="text-[30px] max-medium:text-center text-dark_text">
					Jetzt auf digitale Funkzähler umstellen lassen.
				</p>
				<Link
					className="flex items-center justify-center transition hover:opacity-80 text-white text-center text-lg cursor-pointer py-4 px-5 w-fit rounded-base bg-green"
					href={ROUTE_FRAGEBOGEN}
				>
					Angebot anfordern
				</Link>
			</div>
		</div>
	);
}
