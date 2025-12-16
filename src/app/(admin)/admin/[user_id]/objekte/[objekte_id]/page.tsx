import { getRelatedLocalsByObjektId } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteLocalsAdminAccordion from "../../../../../../components/Admin/ObjekteLocalsAccordion/ObjekteLocalsAdminAccordion";
import { buildSubRoute } from "@/lib/navigation";
import { ROUTE_ADMIN, ROUTE_OBJEKTE } from "@/routes/routes";
import { create_local } from "@/static/icons";
import { buildLocalName } from "@/utils";
import Image from "next/image";
import Link from "next/link";

export default async function AdminObjektDetailsPage({
  params,
}: {
  params: Promise<{ objekte_id: string; user_id: string }>;
}) {
  const { objekte_id, user_id } = await params;

  const relatedLocals = await getRelatedLocalsByObjektId(objekte_id);

  // Sort alphabetically by local name
  relatedLocals.sort((a, b) => {
    const nameA = buildLocalName(a).toLowerCase();
    const nameB = buildLocalName(b).toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const createUnitLink = await buildSubRoute("create-unit");

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={`${ROUTE_ADMIN}/${user_id}${ROUTE_OBJEKTE}`}
        title={`Wohneinheiten`}
      />
      <ContentWrapper className="space-y-4 grid grid-rows-[1fr_auto]">
        <ObjekteLocalsAdminAccordion
          objektID={objekte_id}
          userID={user_id}
          locals={relatedLocals}
        />
        <Link
          href={createUnitLink}
          className="border-dashed w-full max-xl:text-base flex p-5 flex-col items-center justify-center text-xl text-dark_green/50 border border-dark_green rounded-2xl"
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="max-w-7 opacity-50 max-h-7 max-xl:max-w-5 max-xl:max-h-5"
            src={create_local}
            alt="create local"
          />
          Einheit hinzufügen
        </Link>
      </ContentWrapper>
    </div>
  );
}
