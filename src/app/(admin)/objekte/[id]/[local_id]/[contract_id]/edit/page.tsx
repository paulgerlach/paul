import {
  getContractByID,
  getRelatedContractors,
  getSignedUrlsForObject,
} from "@/api";
import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import EditContractForm from "@/components/Admin/Forms/Edit/EditContractForm";
import { ROUTE_OBJEKTE } from "@/routes/routes";

export default async function EditContractPage({
  params,
}: {
  params: Promise<{ id: string; local_id: string; contract_id: string }>;
}) {
  const { id, local_id, contract_id } = await params;

  const { contract } = await getContractByID(contract_id);
  const relatedContractors = await getRelatedContractors(contract_id);

  if (!contract) {
    return <div>Contract nicht gefunden</div>;
  }

  const documentFilesUrls = await getSignedUrlsForObject(contract_id);

  return (
    <div className="py-6 px-9 max-medium:px-4 max-medium:py-4 h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] max-xl:h-[calc(100dvh-53px)] max-xl:max-h-[calc(100dvh-53px)] max-medium:h-auto max-medium:max-h-none grid grid-rows-[auto_1fr]">
      <Breadcrumb
        backTitle="Wohneinheiten"
        link={`${ROUTE_OBJEKTE}/${local_id}`}
        title="Objekte"
      />
      <ContentWrapper className="space-y-4">
        <div className="px-10 py-9 max-medium:px-4 max-medium:py-4 rounded-2xl max-medium:rounded-xl space-y-5 bg-[#FDFDFC]">
          <EditContractForm
            id={id}
            contractID={contract_id}
            localID={local_id}
            uploadedDocuments={documentFilesUrls}
            initialValues={{
              is_current: contract.is_current ? contract.is_current : false,
              additional_costs: Number(contract.additional_costs),
              cold_rent: Number(contract.cold_rent),
              deposit: Number(contract.deposit),
              rental_end_date: contract.rental_end_date
                ? new Date(contract.rental_end_date)
                : new Date(),
              rental_start_date: contract.rental_start_date
                ? new Date(contract.rental_start_date)
                : new Date(),
              custody_type: contract.custody_type,
              contractors: relatedContractors.map((contractor) => ({
                first_name: contractor.first_name,
                last_name: contractor.last_name,
                birth_date: contractor.birth_date
                  ? new Date(contractor.birth_date)
                  : new Date(),
                email: contractor.email || "",
                phone: contractor.phone || "",
              })),
              documents: [],
            }}
          />
        </div>
      </ContentWrapper>
    </div>
  );
}
