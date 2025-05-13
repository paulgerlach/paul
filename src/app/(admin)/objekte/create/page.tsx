import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import CreateObjekteForm from "@/components/Admin/Forms/CreateObjekteForm";
import { ROUTE_OBJEKTE } from "@/routes/routes";
import { breadcrum_arrow } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default function ObjekteCreatePage() {
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
        Wohneinheiten
      </Link>
      <h1 className="mb-4 text-lg">Objekte</h1>
      <ContentWrapper className="space-y-4 max-h-[90%]">
        <div className="px-10 py-9 rounded-2xl space-y-5 bg-[#FDFDFC]">
          <CreateObjekteForm />
        </div>
      </ContentWrapper>
    </div>
  );
}
