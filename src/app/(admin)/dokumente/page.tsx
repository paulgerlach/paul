import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
// import HeatingBillPreview from "@/components/Admin/Docs/Render/HeatingBillPreview/HeatingBillPreview";
// import HeidiSystemsPdf from "@/components/Admin/Docs/Render/HeidiSystemsPdf/HeidiSystemsPdf";
import { ROUTE_DASHBOARD } from "@/routes/routes";

export default function DokumentePage() {
  return (
    <div className="py-6 px-9 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Umlageschlüssel"
        link={ROUTE_DASHBOARD}
        title="Dokumente organisieren"
        subtitle="Die fertig erstellten Betriebskostenabrechnung können nun die Ihre Mietparteinversenden. Alle Informationen zur Zahlung befinden sich bereits automatisiert auf dem Dokument."
      />
      <ContentWrapper className="max-h-[90%]">
        {/* <HeatingBillPreview /> */}
        {/* <HeidiSystemsPdf /> */}
      </ContentWrapper>
    </div>
  );
}
