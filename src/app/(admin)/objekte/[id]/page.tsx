import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteLocalsAccordion from "@/components/Admin/ObjekteLocalsAccordion/ObjekteLocalsAccordion";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import {
  breadcrum_arrow,
  create_local,
  objekte1,
  objekte2,
  objekte3,
  objekte4,
} from "@/static/icons";
import type { ObjektType } from "@/types";
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
    id: 1,
    locals: [
      {
        id: 1,
        available: false,
        name: "EG Hinterhaus, 185qm",
        status: "renting",
        type: "commercial",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
      {
        id: 2,
        available: true,
        name: "1. OG Vorderhaus rechts, 76qm",
        status: "vacancy",
        type: "condominium",
      },
      {
        id: 3,
        available: false,
        name: "1. OG Vorderhaus links, 76qm",
        status: "renting",
        type: "condominium",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
      {
        id: 4,
        available: false,
        name: "2. OG Vorderhaus, 124qm",
        status: "renting",
        type: "condominium",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    image: objekte2,
    street: "Plauensche Str. 114, 10999 Berlin",
    privateLocals: 17,
    message: "Auszug Im August",
    percent: 35,
    status: "lower",
    locals: [
      {
        id: 1,
        available: false,
        name: "EG Hinterhaus, 185qm",
        status: "renting",
        type: "commercial",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
      {
        id: 2,
        available: true,
        name: "1. OG Vorderhaus rechts, 76qm",
        status: "vacancy",
        type: "condominium",
      },
      {
        id: 3,
        available: false,
        name: "1. OG Vorderhaus links, 76qm",
        status: "renting",
        type: "condominium",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
      {
        id: 4,
        available: false,
        name: "2. OG Vorderhaus, 124qm",
        status: "renting",
        type: "condominium",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    image: objekte3,
    street: "Tucholsky Str. 43, 10627 Berlin",
    commercialLocals: 1,
    privateLocals: 4,
    message: "1 freie Wohnung",
    percent: 25,
    status: "higher",
    locals: [
      {
        id: 1,
        available: false,
        name: "EG Hinterhaus, 185qm",
        status: "renting",
        type: "commercial",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
      {
        id: 2,
        available: true,
        name: "1. OG Vorderhaus rechts, 76qm",
        status: "vacancy",
        type: "condominium",
      },
      {
        id: 3,
        available: false,
        name: "1. OG Vorderhaus links, 76qm",
        status: "renting",
        type: "condominium",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
      {
        id: 4,
        available: false,
        name: "2. OG Vorderhaus, 124qm",
        status: "renting",
        type: "condominium",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    image: objekte4,
    street: "Immanuelkirch Str. 12, 10627 Berlin",
    privateLocals: 0,
    message: "Voll vermietet",
    percent: 0,
    status: "full",
    locals: [
      {
        id: 1,
        available: false,
        name: "EG Hinterhaus, 185qm",
        status: "renting",
        type: "commercial",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
      {
        id: 2,
        available: true,
        name: "1. OG Vorderhaus rechts, 76qm",
        status: "vacancy",
        type: "condominium",
      },
      {
        id: 3,
        available: false,
        name: "1. OG Vorderhaus links, 76qm",
        status: "renting",
        type: "condominium",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
      {
        id: 4,
        available: false,
        name: "2. OG Vorderhaus, 124qm",
        status: "renting",
        type: "condominium",
        history: [
          {
            id: 1,
            active: true,
            days: 365,
            end_date: "31.12.2023",
            start_date: "01.01.2023",
            price_per_month: 100,
            first_name: "Max",
            last_name: "Mustermann",
          },
          {
            id: 2,
            active: false,
            days: 365,
            end_date: "31.12.2022",
            start_date: "01.01.2022",
            price_per_month: 100,
            first_name: "Klaus",
            last_name: "Kleber",
          },
        ],
      },
    ],
  },
];

export default async function ObjektDeatilsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const object = objekts.find((item) => item.id === Number(id));

  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Link
        className="flex items-center w-fit text-black/50 text-sm justify-start gap-2"
        href={ROUTE_OBJEKTE}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-5 max-h-5"
          src={breadcrum_arrow}
          alt="breadcrum_arrow"
        />
        Objekte
      </Link>
      <h1 className="mb-4 text-lg">Wohneinheiten | {object?.street}</h1>
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto] max-h-[90%]">
        <ObjekteLocalsAccordion id={id} locals={object?.locals} />
        <Link
          href={`${ROUTE_OBJEKTE}/${id}/create-locale`}
          className="border-dashed w-full flex p-5 flex-col items-center justify-center text-xl text-dark_green/50 border border-dark_green rounded-2xl">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-7 opacity-50 max-h-7"
            src={create_local}
            alt="objekte"
          />
          Einheit hinzufügen
        </Link>
      </ContentWrapper>
    </div>
  );
}
