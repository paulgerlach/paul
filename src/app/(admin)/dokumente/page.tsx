import { getObjektsWithLocals, getCurrentUserDocuments } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import DokumenteLayout from "@/components/Admin/Docs/DokumenteLayout/DokumenteLayout";
import { ROUTE_DASHBOARD } from "@/routes/routes";

export default async function DokumentePage() {
  const [objektsWithLocals, documents] = await Promise.all([
    getObjektsWithLocals(),
    getCurrentUserDocuments()
  ]);
  
  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Umlageschlüssel"
        link={ROUTE_DASHBOARD}
        title="Dokumente organisieren"
        subtitle="Die fertig erstellten Betriebskostenabrechnung können nun die Ihre Mietparteinversenden. Alle Informationen zur Zahlung befinden sich bereits automatisiert auf dem Dokument."
      />
      <ContentWrapper className="h-full">
        <DokumenteLayout objektsWithLocals={objektsWithLocals} documents={documents} />
      </ContentWrapper>
    </div>
  );
}
