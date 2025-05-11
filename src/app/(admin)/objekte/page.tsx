import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteItem from "@/components/Admin/ObjekteItem/ObjekteItem";
import { ROUTE_DASHBOARD } from "@/routes/routes";
import {
  breadcrum_arrow,
  objekte1,
  objekte2,
  objekte3,
  objekte4,
} from "@/static/icons";
import { type ObjektType } from "@/types";
import Image from "next/image";
import Link from "next/link";

const objekts: ObjektType[] = [
  {
    image: objekte1,
    street: "Schmelzhütten Str. 39, 10117 Berlin",
    commercialLocals: 2,
    privateLocals: 21,
    message: "+1 Vermietung Im Juni",
    percent: 10,
    status: "higher",
  },
  {
    image: objekte2,
    street: "Plauensche Str. 114, 10999 Berlin",
    privateLocals: 17,
    message: "Auszug Im August",
    percent: 35,
    status: "lower",
  },
  {
    image: objekte3,
    street: "Tucholsky Str. 43, 10627 Berlin",
    commercialLocals: 1,
    privateLocals: 4,
    message: "1 freie Wohnung",
    percent: 25,
    status: "higher",
  },
  {
    image: objekte4,
    street: "Immanuelkirch Str. 12, 10627 Berlin",
    privateLocals: 0,
    message: "Voll vermietet",
    percent: 0,
    status: "full",
  },
];

export default async function ObjektePage() {
  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Link
        className="flex items-center text-black/50 text-sm justify-start gap-2"
        href={ROUTE_DASHBOARD}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-5 max-h-5"
          src={breadcrum_arrow}
          alt="breadcrum_arrow"
        />
        Dashboard
      </Link>
      <h1 className="mb-4 text-lg">Objekte</h1>
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto] max-h-[90%]">
        <div className="overflow-y-auto space-y-4">
          {objekts.map((objekt) => (
            <ObjekteItem key={objekt.street} item={objekt} />
          ))}
        </div>
        <div></div>
      </ContentWrapper>
    </div>
  );
}
