import { getObjektsWithLocalsByUserID, getDocumentsByObjektIds } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import DokumenteLayout from "@/components/Admin/Docs/DokumenteLayout/DokumenteLayout";
import { ROUTE_ADMIN } from "@/routes/routes";

interface DokumentePageProps {
  params: Promise<{
    user_id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DokumentePage({ params, searchParams }: DokumentePageProps) {
  const { user_id } = await params;
  const resolvedSearchParams = await searchParams;
  const includeHistory = resolvedSearchParams?.includeHistory === 'true';

  const objektsWithLocals = await getObjektsWithLocalsByUserID(user_id);

  // Get documents by objekt IDs (avoids user_id mismatch in admin context)
  const objektIds = objektsWithLocals
    .map((o) => o.id)
    .filter((id): id is string => Boolean(id));
  const documents = await getDocumentsByObjektIds(objektIds, includeHistory);

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
