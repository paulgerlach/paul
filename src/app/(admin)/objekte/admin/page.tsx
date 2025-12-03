import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { ROUTE_DASHBOARD, ROUTE_OBJEKTE_CREATE } from "@/routes/routes";
import { objekte } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";
import { getObjekts } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ObjekteItem from "@/components/Admin/ObjekteItem/ObjekteItem";

export default async function ObjekteAdminPage() {
  const objekts = await getObjekts();

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-[calc(100dvh-53px)] max-medium:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Dashboard"
        link={ROUTE_DASHBOARD}
        title="Objekte"
      />
      <ContentWrapper className="space-y-4 max-medium:space-y-3 grid grid-rows-[1fr_auto] overflow-hidden">
        <div className="overflow-y-auto space-y-4 max-medium:space-y-3">
          {objekts.map((objekt) => (
            <ObjekteItem key={objekt.id} item={objekt} />
          ))}
        </div>
        <Link
          href={ROUTE_OBJEKTE_CREATE}
          className="border-dashed w-full max-xl:text-base max-medium:text-sm flex p-5 max-medium:p-3 flex-col items-center justify-center text-xl text-dark_green/50 border border-dark_green rounded-2xl max-medium:rounded-xl flex-shrink-0"
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-7 opacity-50 max-h-7 max-xl:max-w-5 max-xl:max-h-5 max-medium:max-w-4 max-medium:max-h-4"
            src={objekte}
            alt="objekte"
          />
          Weiteres Objekt hinzufügen
        </Link>
      </ContentWrapper>
    </div>
  );
}
