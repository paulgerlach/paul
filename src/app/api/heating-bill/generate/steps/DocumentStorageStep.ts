import { BaseStep } from "./BaseStep";
import { HeatingBillContext } from "../context/HeatingBillContext";
import { supabaseServer } from "@/utils/supabase/server";
import { logger } from "@/utils/logger";
import database from "@/db";
import { documents } from "@/db/drizzle/schema";

export class DocumentStorageStep extends BaseStep {
    async execute(context: HeatingBillContext): Promise<void> {
        if (!context.pdfBuffer) {
            throw new Error("PDF buffer is empty");
        }

        // 13. Upload to Supabase storage
        const supabase = await supabaseServer();
        const fileName = `heating_bill_${context.apartmentId}_${Date.now()}.pdf`;
        const storagePath = `${context.userId}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("documents")
            .upload(storagePath, context.pdfBuffer, {
                contentType: "application/pdf",
                upsert: true,
            });

        if (uploadError) {
            logger.error("Failed to upload PDF to storage", { error: uploadError });
            const error = new Error("Upload fehlgeschlagen");
            (error as any).code = "UPLOAD_FAILED";
            (error as any).message = uploadError.message;
            throw error;
        }

        context.fileName = fileName;
        context.storagePath = storagePath;

        // 14. Insert document record
        const [documentRecord] = await database
            .insert(documents)
            .values({
                document_name: `Heizkostenabrechnung_${context.apartmentId || "Apartment"}.pdf`,
                document_url: storagePath,
                related_id: context.documentId,
                related_type: "heating_bill",
                user_id: context.userId,
            })
            .returning();

        context.documentRecord = documentRecord;

        // 15. Get signed URL for the document (bucket is private)
        const { data: urlData, error: urlError } = await supabase.storage
            .from("documents")
            .createSignedUrl(storagePath, 60 * 60); // 1 hour expiry

        if (urlError) {
            logger.error("Failed to create signed URL", { error: urlError });
            const error = new Error("URL-Erstellung fehlgeschlagen");
            (error as any).code = "URL_FAILED";
            (error as any).message = urlError.message;
            throw error;
        }

        context.signedUrl = urlData.signedUrl;

        logger.info("PDF generated and uploaded successfully", {
            documentId: documentRecord.id,
            storagePath,
            signedUrl: urlData.signedUrl,
        });
    }
}
