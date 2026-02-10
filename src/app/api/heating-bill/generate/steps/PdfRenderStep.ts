import React from "react";
import { BaseStep } from "./BaseStep";
import { HeatingBillContext } from "../context/HeatingBillContext";
import { renderToBuffer } from "@react-pdf/renderer";
import HeidiSystemsPdfServer from "@/components/Admin/Docs/Render/HeidiSystemsPdf/HeidiSystemsPdfServer";
import { logger } from "@/utils/logger";

export class PdfRenderStep extends BaseStep {
    async execute(context: HeatingBillContext): Promise<void> {
        if (!context.pdfProps) {
            throw new Error("PDF Props not ready");
        }

        logger.info("Generating PDF server-side", {
            documentId: context.documentId,
            apartmentId: context.apartmentId,
            invoiceCount: context.billingInvoices,
            contractCount: context.contracts.length,
        });

        // 12. Render PDF to buffer server-side
        context.pdfBuffer = await renderToBuffer(
            React.createElement(HeidiSystemsPdfServer, context.pdfProps) as any,
        );
    }
}
