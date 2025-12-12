import { getObjektsWithLocalsByUserID, getDocumentsByUserId } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import DokumenteLayout from "@/components/Admin/Docs/DokumenteLayout/DokumenteLayout";
import { ROUTE_ADMIN } from "@/routes/routes";

interface DokumentePageProps {
  params: Promise<{
    user_id: string;
  }>;
}

export default async function DokumentePage({ params }: DokumentePageProps) {
  const { user_id } = await params;
  const [objektsWithLocals, documents] = await Promise.all([
    getObjektsWithLocalsByUserID(user_id),
    getDocumentsByUserId(user_id)
  ]);
  
  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Dashboard"
        link={`${ROUTE_ADMIN}/${user_id}/dashboard`}
        title="Dokumente organisieren"
        subtitle="Die fertig erstellten Betriebskostenabrechnung können nun die Ihre Mietparteinversenden. Alle Informationen zur Zahlung befinden sich bereits automatisiert auf dem Dokument."
      />
      <ContentWrapper className="h-full">
        <DokumenteLayout userId={user_id} objektsWithLocals={objektsWithLocals} documents={documents} />
      </ContentWrapper>
    </div>
  );
}
