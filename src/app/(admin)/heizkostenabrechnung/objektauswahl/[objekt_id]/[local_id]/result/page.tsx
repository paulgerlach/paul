import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import HeidiSystemsPdf from "@/components/Admin/Docs/Render/HeidiSystemsPdf/HeidiSystemsPdf";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export default async function ResultLocalPDF() {
    return (
        <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
            <Breadcrumb
                backTitle="Objekte"
                link={ROUTE_OBJEKTE}
                title="Detailansicht"
                subtitle="Die fertig erstellten Betriebskostenabrechnung können nun die "
            />
            <ContentWrapper className="space-y-4 max-h-[90%]">
                <HeidiSystemsPdf />
            </ContentWrapper>
        </div>
    )
}