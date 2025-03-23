import { ROUTE_FRAGEBOGEN } from "@/routes/routes";
import Image from "next/image";
import Link from "next/link";
import { LazyLottie } from "../Lottie/LazyLottie";
import { animation11 } from "@/static/lottieAnimations";
import { hero_process_bg, hero_process_small } from "@/static/icons";

export default function FunktionenHero() {
  return (
    <div className="bg-[#FAFAF9] grid items-center grid-cols-2 max-medium:grid-cols-1 gap-7 pt-8 pl-[120px] max-large:pl-20 max-medium:pl-10 max-small:pl-5 pb-4 pr-4">
      <div>
        <h1 className="text-[65px] max-megalarge:text-[50px] max-megalarge:leading-[1] max-large:text-4xl max-medium:text-2xl leading-[78px] text-dark_text mb-2">
          Daten mit höchster <br />
          Effizienz bearbeiten
        </h1>
        <p className="text-dark_text text-xl">
          Auf gesetzlich vorgeschrieben Zähler umstellen <br />
          und Verbräuche digital ablesen
        </p>
        <Link
          href={ROUTE_FRAGEBOGEN}
          className="max-medium:w-full w-fit text-center block py-5 max-medium:py-3 px-10 text-lg text-dark_text bg-green rounded-halfbase my-5">
          Jetzt installieren lassen
        </Link>
        <p className="text-dark_text text-xl">
          Kostenfreie Installation der Funkgeräte
        </p>
      </div>
      <div className="grid-cols-2 h-full grid max-w-[689px] w-full gap-5">
        <div className="relative mb-20">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            src={hero_process_bg}
            alt="hero_process_bg"
          />
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            src={hero_process_small}
            alt="hero_process_small"
          />
        </div>
        <LazyLottie
          id="hero-process-animation"
          animationData={animation11}
          wrapperClassName="relative mt-20"
        />
      </div>
    </div>
  );
}
