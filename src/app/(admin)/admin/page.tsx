import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export default function AdminPage() {
    return (
        <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
            <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="User Übersicht" />
            <ContentWrapper className="max-h-[90%] grid grid-cols-3 gap-2 grid-rows-10">

            </ContentWrapper>
        </div>
    )
}