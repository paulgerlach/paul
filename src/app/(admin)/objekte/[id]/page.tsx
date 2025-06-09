import { getRelatedLocalsByObjektId } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteLocalsAccordion from "@/components/Admin/ObjekteLocalsAccordion/ObjekteLocalsAccordion";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { create_local } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default async function ObjektDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const relatedLocals = await getRelatedLocalsByObjektId(id);

  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Objekte"
        link={ROUTE_OBJEKTE}
        title={`Wohneinheiten`}
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto] max-h-[90%]">
        <ObjekteLocalsAccordion id={id} locals={relatedLocals} />
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
