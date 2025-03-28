"use client";

import { ROUTE_FUNKTIONEN } from "@/routes/routes";
import { arrow } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";
import { LazyLottie } from "@/components/Lottie/LazyLottie";
import { animation10 } from "@/static/lottieAnimations";

export default function NavFunktionenRightSide() {
  return (
    <Link className="group" href={ROUTE_FUNKTIONEN}>
      <p className="mb-5 text-xl flex items-center justify-between text-dark_text">
        Funktionshighlight
        <span className="group-hover:translate-x-1 duration-300">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="size-2.5 max-w-2.5 max-h-2.5"
            style={{ width: "100%", height: "auto" }}
            alt="arrow"
            src={arrow}
          />
        </span>
      </p>
      <LazyLottie animationData={animation10} id="animation10" />
      <p className="text-dark_text text-[15px] font-bold mb-3">Dashboard</p>
      <p className="text-xs text-dark_text">
        Sehen Sie alle Verbräuche in Echtzeit in einem übersichtlichen Dashboard
      </p>
    </Link>
  );
}
