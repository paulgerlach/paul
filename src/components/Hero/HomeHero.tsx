import { animation2 } from "@/static/lottieAnimations";
import HeroTicker from "../Basic/Ticker/HeroTicker";
import { LazyLottie } from "@/components/Lottie/LazyLottie";
import Image from "next/image";
import { counter, google, handyman, star } from "@/static/icons";
import Link from "next/link";
import { ROUTE_BLOG, ROUTE_FRAGEBOGEN } from "@/routes/routes";

export default function HomeHero() {
  return (
    <div className="pt-[1px] bg-dark_green">
      <div className="px-4">
        <h1 className="mt-28 max-large:mt-12 text-white text-[65px] max-medium:text-3xl leading-[78px] text-center mb-2">
          Fernablesung mit Funkgeräten
        </h1>
        <p className="text-2xl leading-[28px] max-medium:text-sm max-medium:leading-4 max-medium:text-white/60 text-white text-center max-w-3xl mx-auto my-6">
          Effiziente Fernablesung für Warmwasser, Kaltwasser und Heizung – mit
          fortschrittlicher Funktechnologie
        </p>
        <div className="flex items-center justify-center mx-auto w-fit border border-white/20 max-small:flex-col rounded-[40px] py-2.5 px-4 max-medium:hidden gap-3 mb-10">
          <span className="flex items-center justify-start gap-2">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              src={google}
              alt="google"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-4 colored-to-white opacity-80"
              src={star}
              alt="rate star"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-4 colored-to-white opacity-80"
              src={star}
              alt="rate star"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-4 colored-to-white opacity-80"
              src={star}
              alt="rate star"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-4 colored-to-white opacity-80"
              src={star}
              alt="rate star"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-4 colored-to-white opacity-80"
              src={star}
              alt="rate star"
            />
          </span>
          <span className="text-[15px] leading-[18px] text-white text-center">
            4.8 Rating
          </span>
          <span className="text-[15px] leading-[18px] text-white/70 text-center">
            1.850+ Bewertungen
          </span>
        </div>
        <Link
          href={ROUTE_FRAGEBOGEN}
          className="block text-center mx-auto max-medium:w-full w-fit py-5 max-medium:py-3 px-10 text-lg text-dark_text bg-green rounded-halfbase mb-4">
          Jetzt installieren lassen
        </Link>
        <Link
          href={ROUTE_BLOG}
          className="text-center mx-auto block text-[15px] leading-[18px] text-white">
          Fernablesbare Zähler verpflichtend bis 1. Januar 2027
        </Link>
      </div>
      <div className="px-[72px] mt-[70px] mb-10 max-medium:flex-col w-fit mx-auto max-medium:pr-0 max-medium:justify-end grid grid-cols-4 gap-2 max-medium:px-0">
        <div className="bg-card_bg px-9 rounded-base flex items-center justify-center max-medium:hidden">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            src={counter}
            alt="counter"
          />
        </div>
        <LazyLottie
          animationData={animation2}
          id="animation2hero"
          wrapperClassName="w-fit col-span-2 max-medium:col-span-4 max-medium:bg-transparent max-medium:ml-auto max-medium:mr-0 bg-card_bg rounded-base max-h-[324px] overflow-hidden"
        />
        <div className="small:w-full max-h-[324px] overflow-hidden rounded-base w-full max-medium:hidden">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="w-full rounded-base object-contain"
            src={handyman}
            alt="handyman"
          />
        </div>
      </div>
      <HeroTicker />
    </div>
  );
}
