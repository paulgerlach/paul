import { animation7, animation8, animation9 } from "@/static/lottieAnimations";
import { LazyLottie } from "../Lottie/LazyLottie";

export default function AnimationsSection() {
  return (
    <div
      id="animations"
      className="px-20 max-large:px-16 max-medium:px-10 max-small:px-5 my-16 max-small:my-8">
      <div className="grid grid-cols-3 max-medium:grid-cols-1 gap-6">
        <div className="space-y-6">
          <LazyLottie
            animationData={animation7}
            id="animation7"
            wrapperClassName="relative max-h-[317px] overflow-hidden rounded-base max-large:max-h-fit h-full"
          />
          <div>
            <p className="text-dark_text font-bold text-[15px]">
              Betriebskostenabrechnung
            </p>
            <p className="line-clamp-3 text-dark_text text-[15px]">
              Automatisierte und präzise Erfassung aller relevanten
              Verbrauchsdaten für effiziente Betriebskostenabrechnung.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <LazyLottie
            animationData={animation8}
            id="animation8"
            wrapperClassName="relative max-h-[317px] overflow-hidden rounded-base max-large:max-h-fit h-ful"
          />
          <div>
            <p className="text-dark_text font-bold text-[15px]">
              Kostenfreie Wartung
            </p>
            <p className="line-clamp-3 text-dark_text text-[15px]">
              Regelmäßige Wartung Ihrer Funkzähler sorgt für eine zuverlässige
              und fehlerfreie Datenerfassung.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <LazyLottie
            animationData={animation9}
            id="animation9"
            wrapperClassName="relative max-h-[317px] overflow-hidden rounded-base max-large:max-h-fit h-full"
          />
          <div>
            <p className="text-dark_text font-bold text-[15px]">
              Serviceangebot
            </p>
            <p className="line-clamp-3 text-dark_text text-[15px]">
              Von der Installation über die Wartung bis zur digitalen
              Verbrauchsanalyse: Unser Service deckt alle Bereiche ab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
