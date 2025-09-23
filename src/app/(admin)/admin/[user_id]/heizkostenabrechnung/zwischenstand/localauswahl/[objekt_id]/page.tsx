import { getRelatedLocalsByObjektId } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import AdminObjekteItemLocalDocAccordion from "../../../../../../../../components/Admin/ObjekteLocalsAccordion/Admin/AdminObjekteItemLocalDocAccordion";
import ObjekteItemLocalDocAccordion from "../../../../../../../../components/Admin/ObjekteLocalsAccordion/ObjekteItemLocalDocAccordion";
import { ROUTE_ADMIN, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { cost_type_plus } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default async function ObjektDetailsPage({
  params,
}: {
  params: Promise<{ objekt_id: string; user_id: string }>;
}) {
  const { objekt_id, user_id } = await params;

  const relatedLocals = await getRelatedLocalsByObjektId(objekt_id);

  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}/zwischenstand/localauswahl`}
        title={`Wohneinheiten`}
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto]">
        <AdminObjekteItemLocalDocAccordion
          objektID={objekt_id}
          userID={user_id}
          locals={relatedLocals}
        />
        <Link
          href={`${ROUTE_ADMIN}/${user_id}${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/${objekt_id}`}
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
          Weitere Heizkostenabrechnung hinzufügen
        </Link>
      </ContentWrapper>
    </div>
  );
}
