import { getObjektsByUserID } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminObjekteItemDocAccordion from "../../../../../../../ObjekteLocalsAccordion/Admin/AdminObjekteItemDocAccordion";
import { buildSubRoute } from "@/lib/navigation";
import { ROUTE_BETRIEBSKOSTENABRECHNUNG } from "@/routes/routes";
import { cost_type_plus } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default async function ZwischenstandPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await params;
  const objekts = await getObjektsByUserID(user_id);
  const innerLink = await buildSubRoute("objektauswahl");

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Dashboard"
        link={ROUTE_BETRIEBSKOSTENABRECHNUNG}
        title="Dokumentenübersicht"
        subtitle="Für welche Immobilie wollen Sie eine Betriebskostenabrechnung erstellen lassen?"
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto]">
        <AdminObjekteItemDocAccordion objekts={objekts} />
        <Link
          href={innerLink}
          className="border-dashed w-full max-xl:text-base flex p-5 items-center justify-center text-xl gap-8 text-dark_green/50 border border-dark_green rounded-2xl"
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-5 opacity-50 max-h-5 max-xl:max-w-4 max-xl:max-h-4"
            src={cost_type_plus}
            alt="cost_type_plus"
          />
          Weitere Betreibskostenabrechnung hinzufügen
        </Link>
      </ContentWrapper>
    </div>
  );
}
