import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { ROUTE_DASHBOARD } from "@/routes/routes";

export default function DokumentePage() {
  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Umlageschlüssel"
        link={ROUTE_DASHBOARD}
        title="Dokumente organisieren"
        subtitle="Die fertig erstellten Betriebskostenabrechnung können nun die Ihre Mietparteinversenden. Alle Informationen zur Zahlung befinden sich bereits automatisiert auf dem Dokument."
      />
      <ContentWrapper className="max-h-[90%]"></ContentWrapper>
    </div>
  );
}
