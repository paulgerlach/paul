import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export default function AdminPage() {
    return (
        <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
            <Breadcrumb backTitle="Objekte" link={ROUTE_OBJEKTE} title="User Übersicht" />
            <ContentWrapper className="max-h-[90%] grid grid-cols-3 gap-2 grid-rows-10">

            </ContentWrapper>
        </div>
    )
}