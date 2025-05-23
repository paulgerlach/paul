import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export default async function ObjekteInfoPage() {
  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={ROUTE_OBJEKTE}
        title="Objekte | "
      />
    </div>
  );
}
