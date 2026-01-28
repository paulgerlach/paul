import {
	caract_battery,
	caract_mark,
	caract_mind,
	caract_radio,
	caract_sniper,
	caract_vector,
	realtime,
	server,
} from "@/static/icons";
import Image, { StaticImageData } from "next/image";

type EigenschaftItem = {
	icon: StaticImageData;
	text: string;
	filterGreen?: boolean;
};

// Original desktop items (8 items in 2 columns)
const desktopItems1: EigenschaftItem[] = [
	{ icon: caract_vector, text: "Akustische Leckageerkennung" },
	{ icon: caract_radio, text: "Fernablesung" },
	{ icon: realtime, text: "Echtzeit-Messwerte", filterGreen: true },
	{ icon: server, text: "Server in Europa", filterGreen: true },
];

const desktopItems2: EigenschaftItem[] = [
	{ icon: caract_sniper, text: "Hohe Messgenauigkeit" },
	{ icon: caract_mind, text: "Intelligente Warnsysteme" },
	{ icon: caract_battery, text: "Langlebige Batterie" },
	{ icon: caract_mark, text: "Offizielle Zertifizierungen" },
];

// Mobile items (same 8 items as desktop)
const mobileItems = [
	...desktopItems1,
	...desktopItems2,
];

export default function Eigenschaften() {
	return (
		<div className="px-24 max-large:px-16 max-medium:px-10 max-small:px-5 mt-24 max-medium:my-8 mb-16">
			{/* Desktop: Original 3-column grid layout with 8 items */}
			<div className="max-small:hidden grid grid-cols-3 max-large:grid-cols-2 gap-16 max-large:gap-8">
				<h3 className="max-large:col-span-2 max-large:text-center max-large:mb-12 text-[45px] leading-[54px] text-dark_text">
					Eigenschaften
				</h3>
				<ul className="space-y-10">
					{desktopItems1.map((item, index) => (
						<li key={index} className="flex items-center justify-start gap-5">
							<span className="size-[60px] rounded-full flex items-center justify-center shadow-lg">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className={`size-[30px] ${item.filterGreen ? "filter-to-green" : ""}`}
									src={item.icon}
									alt={item.text}
								/>
							</span>
							<span className="text-dark_text">{item.text}</span>
						</li>
					))}
				</ul>
				<ul className="space-y-10">
					{desktopItems2.map((item, index) => (
						<li key={index} className="flex items-center justify-start gap-5">
							<span className="size-[60px] rounded-full flex items-center justify-center shadow-lg">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className={`size-[30px] ${item.filterGreen ? "filter-to-green" : ""}`}
									src={item.icon}
									alt={item.text}
								/>
							</span>
							<span className="text-dark_text">{item.text}</span>
						</li>
					))}
				</ul>
			</div>

			{/* Mobile: Single column layout matching Figma (6 items) */}
			<div className="hidden max-small:block">
				<h3 className="text-[30px] leading-[36px] text-dark_text mb-10">
					Eigenschaften
				</h3>
				<ul className="space-y-8">
					{mobileItems.map((item, index) => (
						<li key={index} className="flex items-center justify-start gap-5">
							<span className="size-[60px] rounded-full flex items-center justify-center bg-gray-100">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className={`size-[28px] ${item.filterGreen ? "filter-to-green" : ""}`}
									src={item.icon}
									alt={item.text}
								/>
							</span>
							<span className="text-dark_text text-lg">{item.text}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
