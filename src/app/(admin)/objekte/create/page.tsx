import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import CreateObjekteForm from "@/components/Admin/Forms/Create/CreateObjekteForm";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export default function ObjekteCreatePage() {
  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={ROUTE_OBJEKTE}
        title="Objekt hinzufügen"
      />
      <ContentWrapper className="space-y-4 max-medium:space-y-3">
        <div className="px-10 py-9 max-medium:px-4 max-medium:py-4 rounded-2xl max-medium:rounded-xl space-y-5 max-medium:space-y-3 bg-[#FDFDFC]">
          <CreateObjekteForm />
        </div>
      </ContentWrapper>
    </div>
  );
}
