import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import ObjekteItem from "@/components/Admin/ObjekteItem/ObjekteItem";
import { ROUTE_DASHBOARD, ROUTE_OBJEKTE_CREATE } from "@/routes/routes";
import { breadcrum_arrow, objekte } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";
import { eq } from "drizzle-orm";
import database from "@/db";
import { objekte as objekteTable } from "@/db/drizzle/schema";
import { supabaseServer } from "@/utils/supabase/server";
import type { ObjektType } from "@/types";

export default async function ObjektePage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return <div>Unauthorized</div>;
  }

  const objekts = await database
    .select()
    .from(objekteTable)
    .where(eq(objekteTable.user_id, user?.id));
  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Link
        className="flex items-center w-fit text-black/50 text-sm justify-start gap-2"
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
