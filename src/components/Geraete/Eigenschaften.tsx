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
import Image from "next/image";

export default function Eigenschaften() {
  return (
    <div className="px-24 max-large:px-16 max-medium:px-10 max-small:px-5 mt-24 max-medium:my-8 mb-16 grid grid-cols-3 max-large:grid-cols-2 max-medium:grid-cols-1 max-medium:gap-8 gap-16">
      <h3 className="max-large:col-span-2 max-large:text-center max-large:mb-12 max-small:mb-4 max-medium:col-span-1 text-[45px] leading-[54px] max-medium:text-2xl text-dark_text">
        Eigenschaften
      </h3>
      <ul className="space-y-10">
        <li className="flex items-center justify-start gap-5">
          <span className="size-[60px] rounded-full flex items-center justify-center shadow-lg">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-[30px]"
              src={caract_vector}
              alt="lines"
            />
          </span>
          Akustische Leckageerkennung
        </li>
        <li className="flex items-center justify-start gap-5">
          <span className="size-[60px] rounded-full flex items-center justify-center shadow-lg">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-[30px]"
              src={caract_radio}
              alt="lines"
            />
          </span>
          Fernablesung
        </li>
        <li className="flex items-center justify-start gap-5">
          <span className="size-[60px] rounded-full flex items-center justify-center shadow-lg">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-[30px] filter-to-green"
              src={realtime}
              alt="realtime"
            />
          </span>
          Echtzeit-Messwerte
        </li>
        <li className="flex items-center justify-start gap-5">
          <span className="size-[60px] rounded-full flex items-center justify-center shadow-lg">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-[30px] filter-to-green"
              src={server}
              alt="server"
            />
          </span>
          Server in Europa
        </li>
      </ul>
      <ul className="space-y-10">
        <li className="flex items-center justify-start gap-5">
          <span className="size-[60px] rounded-full flex items-center justify-center shadow-lg">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-[30px]"
              src={caract_sniper}
              alt="lines"
            />
          </span>
          Hohe Messgenauigkeit
        </li>
        <li className="flex items-center justify-start gap-5">
          <span className="size-[60px] rounded-full flex items-center justify-center shadow-lg">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-[30px]"
              src={caract_mind}
              alt="lines"
            />
          </span>
          Intelligente Warnsysteme
        </li>
        <li className="flex items-center justify-start gap-5">
          <span className="size-[60px] rounded-full flex items-center justify-center shadow-lg">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-[30px]"
              src={caract_battery}
              alt="lines"
            />
          </span>
          Langlebige Batterie
        </li>
        <li className="flex items-center justify-start gap-5">
          <span className="size-[60px] rounded-full flex items-center justify-center shadow-lg">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="size-[30px]"
              src={caract_mark}
              alt="lines"
            />
          </span>
          Offizielle Zertifizierungen
        </li>
      </ul>
    </div>
  );
}
