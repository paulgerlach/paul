import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import NebenkostenabrechnungPdf from "@/components/Admin/Docs/Render/NebenkostenabrechnungPdf/NebenkostenabrechnungPdf";
import NebenkostenabrechnungPreview from "@/components/Admin/Docs/Render/NebenkostenabrechnungPdf/NebenkostenabrechnungPreview";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export default async function ResultBuildingPDF() {
    return (
        <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
            <Breadcrumb
                backTitle="Objekte"
                link={ROUTE_OBJEKTE}
                title="Detailansicht"
                subtitle="Die fertig erstellten Betriebskostenabrechnung können nun die "
            />
            <ContentWrapper className="space-y-4 max-h-[90%]">
                <NebenkostenabrechnungPdf />
                {/* <NebenkostenabrechnungPreview /> */}
            </ContentWrapper>
        </div>
    )
}