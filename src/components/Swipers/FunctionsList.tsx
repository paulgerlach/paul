import { LazyLottie } from "@/components/Lottie/LazyLottie";
import Image from "next/image";
import { article1 } from "@/static/icons";
import type { FunctionsSlideType } from "@/types";

export const functionsSwiper: FunctionsSlideType[] = [
	{
		item: (
			<Image
				width={0}
				height={0}
				sizes="100vw"
				loading="lazy"
				className="large:w-full max-h-[244px] max-w-[300px] max-medium:max-h-full max-medium:max-w-full overflow-hidden max-large:object-fill"
				src={article1}
				alt="article image"
			/>
		),
		title: "Intelligente Messlösungen",
		subtitle:
			"Statten Sie Ihre Immobilie mit modernster Funktechnologie aus und erfassen Sie Warmwasser-, Kaltwasser- und Heizungsverbrauch sowie Rauchmelderdaten automatisch.",
	},
	{
		item: (
			<LazyLottie
				animationName="Animation_5"
				id="animation5"
				wrapperClassName="relative max-h-[244px] max-w-[300px] max-medium:max-h-full max-medium:max-w-full overflow-hidden max-large:w-full max-large:object-fill"
			/>
		),
		title: "Verbrauchsdaten in Echtzeit",
		subtitle:
			"Behalten Sie Ihren Energieverbrauch stets im Blick. Unsere intelligente Technologie erfasst Verbrauchsdaten in Echtzeit und liefert wertvolle Insights –für eine effiziente Steuerung jederzeit und von überall.",
	},
	{
		item: (
			<LazyLottie
				animationName="Animation_6"
				id="animation6"
				wrapperClassName="relative max-h-[244px] max-w-[300px] max-medium:max-h-full max-medium:max-w-full overflow-hidden max-large:w-full max-large:object-fill"
			/>
		),
		title: "Flexible Bedarfsanpassung",
		subtitle:
			"Wählen Sie mit nur einem Klick die passenden Messgeräte für Ihre Immobilie. Wir übernehmen die Installation und sorgen für eine reibungslose Integration.",
	},
	{
		item: (
			<LazyLottie
				animationName="Animation_4"
				id="animation4"
				wrapperClassName="relative max-h-[244px] max-w-[300px] max-medium:max-h-full max-medium:max-w-full overflow-hidden max-large:w-full max-large:object-fill"
			/>
		),
		title: "Kundenservice 24/7",
		subtitle:
			"Unser Support ist rund um die Uhr für Sie da. Ob technische Fragen oder individuelle Anliegen –wir finden schnelle, kompetente Lösungen, genau dann, wenn Sie sie brauchen.",
	},
];

export default function FunctionsList() {
	return (
		<div className="grid-cols-4 grid max-medium:gap-0 gap-11 max-medium:flex max-large:gap-6">
			{functionsSwiper.map((slide) => (
				<div key={slide.title} className="space-y-6">
					{slide.item}
					<p className="text-dark_text text-xl font-bold leading-[24px]">
						{slide.title}
					</p>
					<p className="text-dark_text leading-5 text-[17px]">
						{slide.subtitle}
					</p>
				</div>
			))}
		</div>
	);
}
