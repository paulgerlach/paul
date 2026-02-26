import { getDocCostCategoryTypes, getHeatingBillDocumentByID, getHeatingInvoicesByHeatingBillDocumentID } from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import CreateDocContentWrapper from "@/components/Admin/ContentWrapper/CreateDocContentWrapper";
import DokumentenmanagementLocalForm from "@/components/Admin/Forms/DocPreparing/Dokumentenmanagement/DokumentenmanagementLocalForm";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";

export default async function DokumentenmanagementPage({
    params,
}: {
    params: Promise<{ doc_id: string; path_slug: string }>;
}) {
    const { doc_id, path_slug } = await params;

    const doc = await getHeatingBillDocumentByID(doc_id);

    const userDocCostCategories = await getDocCostCategoryTypes(
        "heizkostenabrechnung"
    );

    const relatedToDocInvoices = await getHeatingInvoicesByHeatingBillDocumentID(doc_id);

    return (
        <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none max-medium:overflow-y-auto grid grid-rows-[auto_1fr]">
            <Breadcrumb
                backTitle="Abrechnung"
                link={`${ROUTE_HEIZKOSTENABRECHNUNG}/localauswahl/wietermachen/${doc_id}/abrechnungszeitraum`}
                title={`Dokumentenmanagement`}
                subtitle="Ladden Sie alle Ihre Rechnungen und Zahlungsnachweise die für die Betriebskostenabrechnung wichtig sind hoch."
            />
            <CreateDocContentWrapper>
                <DokumentenmanagementLocalForm
                    relatedInvoices={relatedToDocInvoices}
                    userDocCostCategories={userDocCostCategories}
                    docId={doc_id}
                    pathSlug={path_slug}
                    objektId={doc.objekt_id ?? ""}
                    localId={doc.local_id ?? ""} />
            </CreateDocContentWrapper>
        </div>
    );
}