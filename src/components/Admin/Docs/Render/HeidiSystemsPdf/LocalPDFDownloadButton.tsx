"use client";

import { useState } from "react";
import Image from "next/image";
import { doc_download } from "@/static/icons";
import { type HeatingBillPreviewProps } from "../HeatingBillPreview/HeatingBillPreview";

export default function LocalPDFDownloadButton(props: HeatingBillPreviewProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleDownload = async () => {
		setIsLoading(true);
		try {
			console.log("Generating PDF...", {
				documentId: props.mainDoc.id,
				objektId: props.objekt.id,
				apartmentId: props.local.id,
			});

			// Call the server-side PDF generation endpoint
			const response = await fetch("/api/heating-bill/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					documentId: props.mainDoc.id,
					objektId: props.objekt.id,
					apartmentId: props.local.id,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error("API error:", errorData);
				throw new Error(errorData.error || "Fehler beim Generieren der PDF");
			}

			const result = await response.json();
			console.log("PDF generated successfully:", result);

			// Download the PDF from the server URL
			const pdfUrl = result.data.publicUrl;
			const link = document.createElement("a");
			link.href = pdfUrl;
			link.download =
				result.data.fileName || `Heizkostenabrechnung_${props.local.id}.pdf`;
			link.target = "_blank"; // Open in new tab if download doesn't trigger
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Error generating or downloading PDF:", error);
			alert(
				error instanceof Error
					? error.message
					: "Fehler beim Erzeugen oder Herunterladen der PDF.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button
			className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
			onClick={handleDownload}
			disabled={isLoading}
		>
			{isLoading ? (
				<div className="max-w-10 max-h-10 max-xl:max-w-6 max-xl:max-h-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
			) : (
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="max-w-10 max-h-10 max-xl:max-w-6 max-xl:max-h-6"
					src={doc_download}
					alt={"doc_download"}
				/>
			)}
		</button>
	);
}
