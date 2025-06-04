import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteLocalsAccordion from "@/components/Admin/ObjekteLocalsAccordion/ObjekteLocalsAccordion";
import database from "@/db";
import { locals, objekte } from "@/db/drizzle/schema";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { create_local } from "@/static/icons";
import { LocalType } from "@/types";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export default async function ObjektDetailsPage({
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

  const relatedLocals = (
    await database.select().from(locals).where(eq(locals.objekt_id, id))
  ).map((local) => ({
    ...local,
    living_space: Number(local.living_space),
    rooms: local.rooms ? Number(local.rooms) : null,
    house_fee: local.house_fee ? Number(local.house_fee) : null,
    tags: null,
    heating_systems: null,
    documents: null,
  }));

  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Objekte"
        link={ROUTE_OBJEKTE}
        title={`Wohneinheiten | ${object?.street}`}
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto] max-h-[90%]">
        <ObjekteLocalsAccordion id={id} locals={relatedLocals as LocalType[]} />
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
