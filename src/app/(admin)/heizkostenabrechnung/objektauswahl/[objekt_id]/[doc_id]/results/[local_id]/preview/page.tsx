import {
  getDocumentById,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { supabaseServer } from "@/utils/supabase/server";

export default async function ResultLocalPreview({
  params,
  searchParams,
}: {
  params: Promise<{ objekt_id: string; doc_id: string; local_id: string }>;
  searchParams: Promise<{ documentId?: string }>;
}) {
  const { objekt_id, doc_id } = await params;
  const { documentId } = await searchParams;

  let pdfUrl: string | null = null;

  if (documentId) {
    const doc = await getDocumentById(documentId);
    if (doc) {
      const supabase = await supabaseServer();
      const { data } = await supabase.storage
        .from("documents")
        .createSignedUrl(doc.document_url, 3600);
      pdfUrl = data?.signedUrl ?? null;
    }
  }

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Objekte"
        link={`${ROUTE_HEIZKOSTENABRECHNUNG}/objektauswahl/${objekt_id}/${doc_id}/results`}
        title="Detailansicht"
        subtitle="Die fertig erstellten Heizkostenabrechnung können nun die "
      />
      <ContentWrapper className="space-y-4 max-medium:space-y-3 h-full">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full min-h-[70vh] rounded-lg border border-gray-200"
            title="Heizkostenabrechnung PDF"
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Kein Dokument gefunden</p>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
}
