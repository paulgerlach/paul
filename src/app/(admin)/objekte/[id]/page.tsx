import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteLocalsAccordion from "@/components/Admin/ObjekteLocalsAccordion/ObjekteLocalsAccordion";
import database from "@/db";
import { objekte } from "@/db/drizzle/schema";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { breadcrum_arrow, create_local } from "@/static/icons";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export default async function ObjektDeatilsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const object = await database
    .select()
    .from(objekte)
    .where(eq(objekte.id, id))
    .then((res) => res[0]);

  if (!object) {
    return <div>Objekt nicht gefunden</div>;
  }

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
        {/* <ObjekteLocalsAccordion id={id} locals={object?.locals} /> */}
        <Link
          href={`${ROUTE_OBJEKTE}/${id}/create-unit`}
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
