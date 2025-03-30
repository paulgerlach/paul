import { hero_counter, hero_small_counter } from "@/static/icons";
import Image from "next/image";
import { LazyLottie } from "../Lottie/LazyLottie";
import { animation1 } from "@/static/lottieAnimations";
import { ROUTE_FRAGEBOGEN } from "@/routes/routes";
import Link from "next/link";

export default function GeraeteHero() {
  return (
    <div className="bg-[#FAFAF9] flex items-center gap-32 justify-center pt-24 pl-[120px] max-large:pl-20 max-medium:pl-10 max-small:pl-5 pb-4 pr-4">
      <div>
        <h1 className="text-[65px] leading-[78px] text-dark_text mb-2">
          Jetzt auf Funkgeräte <br />
          umstellen
        </h1>
        <p className="text-dark_text text-[15px]">
          Wechseln Sie auf gesetzlich vorgeschriebene Funkzähler <br />
          und erfassen Sie Verbrauchsdaten digital
        </p>
        <Link
          href={ROUTE_FRAGEBOGEN}
          className="max-medium:w-full text-center w-fit block py-5 max-medium:py-3 px-10 text-lg text-dark_text bg-green rounded-halfbase my-5">
          Jetzt installieren lassen
        </Link>
        <p className="text-dark_text text-xl">
          Kostenfreie Installation der Funkgeräte
        </p>
      </div>
      <div className="grid-cols-2 max-large:hidden grid max-w-[686px] gap-5">
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
