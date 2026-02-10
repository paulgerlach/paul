import { User } from "@supabase/supabase-js";
import { GenerateHeatingBillRequest, HeatingBillResponseDTO } from "../types";
import { HeatingBillContext } from "../context/HeatingBillContext";
import { DomainDataLoaderStep } from "../steps/DomainDataLoaderStep";
import { InvoiceTotalsBuilderStep } from "../steps/InvoiceTotalsBuilderStep";
import { ConsumptionProviderStep } from "../steps/ConsumptionProviderStep";
import { AllocationBuilderStep } from "../steps/AllocationBuilderStep";
import { PdfPropsBuilderStep } from "../steps/PdfPropsBuilderStep";
import { PdfRenderStep } from "../steps/PdfRenderStep";
import { DocumentStorageStep } from "../steps/DocumentStorageStep";

export class HeatingBillGenerationManager {
    async generate(
        user: User,
        request: GenerateHeatingBillRequest,
    ): Promise<HeatingBillResponseDTO> {
        const context = new HeatingBillContext(user, request);

        const steps = [
            new DomainDataLoaderStep(),
            new InvoiceTotalsBuilderStep(),
            new ConsumptionProviderStep(),
            new AllocationBuilderStep(),
            new PdfPropsBuilderStep(),
            new PdfRenderStep(),
            new DocumentStorageStep(),
        ];

        for (const step of steps) {
            await step.execute(context);
        }

        return context.toResponse();
    }
}
