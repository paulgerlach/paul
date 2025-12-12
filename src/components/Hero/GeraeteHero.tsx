import { hero_counter, hero_small_counter } from "@/static/icons";
import Image from "next/image";
import { LazyLottie } from "../Lottie/LazyLottie";
import animation1 from "@/animations/Animation_1.json";
import { ROUTE_FRAGEBOGEN } from "@/routes/routes";
import Link from "next/link";

export default function GeraeteHero() {
	return (
		<div className="bg-[#FAFAF9] flex items-center gap-32 justify-center pt-24 max-medium:pt-20 max-small:pt-16 pl-[120px] max-large:pl-20 max-medium:pl-10 max-small:pl-5 pb-4 pr-4 max-small:pr-5 max-medium:flex-col">
			<div className="max-medium:text-center">
				<h1 className="text-[65px] max-medium:text-3xl max-small:text-2xl leading-[78px] max-medium:leading-tight text-dark_text mb-2">
					Jetzt auf Funkgeräte <br className="max-small:hidden" />
					umstellen
				</h1>
				<p className="text-dark_text text-[15px] max-small:text-sm">
					Wechseln Sie auf gesetzlich vorgeschriebene Funkzähler <br className="max-medium:hidden" />
					und erfassen Sie Verbrauchsdaten digital
				</p>
				<Link
					href={ROUTE_FRAGEBOGEN}
					className="max-medium:w-full text-center w-fit block py-5 max-medium:py-3 px-10 text-lg max-small:text-base text-dark_text bg-green rounded-halfbase my-5"
				>
					Jetzt installieren lassen
				</Link>
				<p className="text-dark_text text-xl max-small:text-base">
					Kostenfreie Installation der Funkgeräte
				</p>
			</div>
			<div className="grid-cols-2 max-medium:hidden grid max-w-[686px] gap-5">
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="col-span-2 rounded-base aspect-video h-full object-cover"
					src={hero_counter}
					alt="hero counter image"
				/>
				<div className="flex items-center h-full justify-center bg-[#E0DEDB] rounded-base">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						src={hero_small_counter}
						alt="hero counter image"
					/>
				</div>
				<LazyLottie
					id="hero-pointer"
					wrapperClassName="relative"
					animationData={animation1}
				/>
			</div>
		</div>
	);
}
