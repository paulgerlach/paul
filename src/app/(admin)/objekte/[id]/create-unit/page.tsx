import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import CreateObjekteUnitForm from "@/components/Admin/Forms/CreateObjekteUnitForm";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export default async function CreateLocalePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={ROUTE_OBJEKTE}
        title={`Detailansicht Einheit`}
      />
      <ContentWrapper className="space-y-4 max-h-[90%]">
        <div className="px-10 py-9 rounded-2xl space-y-5 bg-[#FDFDFC]">
          <CreateObjekteUnitForm id={id} />
        </div>
      </ContentWrapper>
    </div>
  );
}
