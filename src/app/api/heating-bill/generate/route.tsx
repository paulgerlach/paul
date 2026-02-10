import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedServerUser } from "@/utils/auth/server";
import { HeatingBillGenerationManager } from "./manager/HeatingBillGenerationManager";

/**
 * Request validation schema for heating bill PDF generation.
 */
const RequestSchema = z.object({
	documentId: z.string().uuid("documentId must be a valid UUID"),
	objektId: z.string().uuid("objektId must be a valid UUID"),
	apartmentId: z.string().uuid("apartmentId must be a valid UUID"),
});

/**
 * POST /api/heating-bill/generate
 *
 * Generates a heating bill PDF for a specific apartment within a settlement.
 * Refactored to use Manager + Builder pattern.
 */
export async function POST(request: NextRequest) {
	try {
		// 1. Authentication check
		const user = await getAuthenticatedServerUser();
		if (!user || !user.id) {
			return NextResponse.json(
				{ error: "Nicht authentifiziert", code: "UNAUTHORIZED" },
				{ status: 401 },
			);
		}

		// 2. Parse and validate request body
		const body = await request.json();
		const validation = RequestSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(
				{
					error: "Ungültige Anfrage",
					code: "VALIDATION_ERROR",
					details: validation.error.issues,
				},
				{ status: 400 },
			);
		}

		// 3. Execute Manager
		const manager = new HeatingBillGenerationManager();
		const result = await manager.generate(user, validation.data);

		return NextResponse.json({
			success: true,
			message: "PDF erfolgreich generiert",
			data: result,
		});
	} catch (error: any) {
		console.error("Error in heating bill generation:", error);

		// Handle specific errors from steps if they have codes/status
		if (error.code === "DOCUMENT_NOT_FOUND") {
			return NextResponse.json(
				{ error: error.message, code: "DOCUMENT_NOT_FOUND" },
				{ status: 404 },
			);
		}

		if (error.code === "UPLOAD_FAILED" || error.code === "URL_FAILED") {
			return NextResponse.json(
				{
					error: error.message || "Upload error",
					code: error.code,
					message: error.message,
				},
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{
				error: "Interner Serverfehler",
				code: "INTERNAL_ERROR",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
