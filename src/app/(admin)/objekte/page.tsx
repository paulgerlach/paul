import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteItem from "@/components/Admin/ObjekteItem/ObjekteItem";
import { ROUTE_DASHBOARD, ROUTE_OBJEKTE_CREATE } from "@/routes/routes";
import { objekte } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";
import { getObjekts } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";

export default async function ObjektePage() {
  const objekts = await getObjekts();

  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Dashboard"
        link={ROUTE_DASHBOARD}
        title="Objekte"
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto] max-h-[90%]">
        <div className="overflow-y-auto space-y-4">
          {objekts.map((objekt) => (
            <ObjekteItem key={objekt.id} item={objekt} />
          ))}
        </div>
        <Link
          href={ROUTE_OBJEKTE_CREATE}
          className="border-dashed w-full flex p-5 flex-col items-center justify-center text-xl text-dark_green/50 border border-dark_green rounded-2xl">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-7 opacity-50 max-h-7"
            src={objekte}
            alt="objekte"
          />
          Weiteres Objekt hinzufügen
        </Link>
      </ContentWrapper>
    </div>
  );
}
