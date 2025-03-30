import { chart1, chart2, chart3, chart5 } from "@/static/icons";
import Image from "next/image";
import { LazyLottie } from "../Lottie/LazyLottie";
import { animation12, animation13 } from "@/static/lottieAnimations";

export default function FunktionenGrid() {
  return (
    <div className="px-[100px] max-large:px-16 max-medium:px-10 max-small:px-5 my-16 max-small:my-8">
      <div className="bg-[#EFEEEC] w-fit mx-auto p-2.5 rounded-[15px] grid grid-cols-3 max-medium:grid-cols-1 gap-2.5">
        <div className="flex flex-col gap-y-3.5 max-w-[385px]">
          <div className="h-fit">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="w-full"
              src={chart1}
              alt="chart"
            />
          </div>
          <div className="h-fit">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="w-full"
              src={chart2}
              alt="chart"
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-3.5 max-w-[385px]">
          <div className="h-fit">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="w-full"
              src={chart3}
              alt="chart"
            />
          </div>
          <LazyLottie
            id="chart4"
            animationData={animation12}
            wrapperClassName="h-full"
          />
        </div>
        <div className="flex flex-col gap-y-3.5 max-w-[385px]">
          <div className="row-span-2 h-fit">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="w-full"
              src={chart5}
              alt="chart"
            />
          </div>
          <LazyLottie
            id="chart6"
            wrapperClassName="h-fit"
            animationData={animation13}
          />
        </div>
      </div>
    </div>
  );
}
