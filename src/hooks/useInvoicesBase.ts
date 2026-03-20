"use client";

import {
	buildInvoiceNotes,
	mapCostCategoryToPurpose,
	processInvoicesViaNext,
} from "@/api/invoices";
import { useUploadDocuments } from "@/apiClient";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import type {
	DocCostCategoryType,
	InvoiceDocumentType,
	LocalType,
} from "@/types";
import { useMutation } from "@tanstack/react-query";
import { parse } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FileRejection } from "react-dropzone";
import { toast } from "sonner";

export type FileEntry = {
	id: string;
	file: File;
	status: "pending" | "analyzing" | "success" | "error" | "saved";
	result?: {
		costType: string;
		costTypeName: string;
		purpose: string;
		invoiceDate: Date | null;
		amount: number | null;
		notes: string;
	};
	error?: string;
};

export type DialogStep = "upload" | "review";

interface UseInvoicesBaseProps {
	objektId: string;
	docId: string;
	userDocCostCategories: DocCostCategoryType[];
	relatedInvoices?: InvoiceDocumentType[];
	userId?: string;
	saveInvoiceAction: (
		payload: any,
		objektID: string,
		operatingDocID: string | null,
		costType: string,
		userId?: string,
	) => Promise<any>;
	nextLink: string;
	locals?: LocalType[];
}

export function useInvoicesBase({
	objektId,
	docId,
	userDocCostCategories,
	relatedInvoices,
	userId,
	saveInvoiceAction,
	nextLink,
	locals,
}: UseInvoicesBaseProps) {
	const router = useRouter();
	const uploadDocuments = useUploadDocuments();

	const {
		setDocumentGroups,
		documentGroups,
		updateDocumentGroup,
		setOperatingDocID,
		setObjektID,
		operatingDocID,
	} = useHeizkostenabrechnungStore();

	const isEditMode = !!relatedInvoices;
	const [entries, setEntries] = useState<FileEntry[]>([]);
	const [step, setStep] = useState<DialogStep>("upload");

	useEffect(() => {
		// Initialize if store is empty OR if we switched to a different document
		if (documentGroups.length === 0 || operatingDocID !== docId) {
			const groups = userDocCostCategories.map((doc) => ({
				...doc,
				data: isEditMode
					? (relatedInvoices?.filter(
						(invoice) => invoice.cost_type === doc.type,
					) ?? [])
					: [],
			}));

			setDocumentGroups(groups);
			setOperatingDocID(docId);
			setObjektID(objektId);
		}
	}, [
		userDocCostCategories,
		setDocumentGroups,
		relatedInvoices,
		isEditMode,
		documentGroups.length,
		docId,
		objektId,
		operatingDocID,
		setOperatingDocID,
		setObjektID,
	]);

	const allPurposeOptions = useMemo(
		() => documentGroups.flatMap((g) => g.options ?? []),
		[documentGroups],
	);

	const parseMutation = useMutation({
		mutationFn: async (filesToProcess: FileEntry[]) => {
			const results = await processInvoicesViaNext(
				filesToProcess.map((e) => e.file),
				userDocCostCategories,
				locals ?? [],
			);
			return { results, filesToProcess };
		},
		onSuccess: (data) => {
			const { results, filesToProcess } = data;

			setEntries((currentEntries) => {
				const updated = currentEntries.map((entry) => {
					const processed = filesToProcess.find((f) => f.id === entry.id);
					if (!processed) return entry;

					const index = filesToProcess.indexOf(processed);
					const invoice = results.invoices?.[index];

					if (!invoice) {
						return {
							...entry,
							status: "error" as const,
							error: "Keine Rechnungsdaten erkannt.",
						};
					}

					const mappedPurpose = mapCostCategoryToPurpose(
						invoice.cost_category_option,
						allPurposeOptions,
					);

					if (!mappedPurpose) {
						return {
							...entry,
							status: "error" as const,
							error: "Kostenart konnte nicht zugeordnet werden.",
						};
					}

					const group = documentGroups.find((g) =>
						g.options?.includes(mappedPurpose),
					);

					if (!group?.type) {
						return {
							...entry,
							status: "error" as const,
							error: "Zugehörige Kategorie nicht gefunden.",
						};
					}

					let invoiceDate: Date | null = null;
					if (invoice.invoice_date) {
						const d = parse(invoice.invoice_date, "dd.MM.yyyy", new Date());
						if (!isNaN(d.getTime())) invoiceDate = d;
					}

					return {
						...entry,
						status: "success" as const,
						result: {
							costType: group.type,
							costTypeName: group.name ?? "Unbekannt",
							purpose: mappedPurpose,
							invoiceDate,
							amount:
								typeof invoice.gross_amount === "number"
									? invoice.gross_amount
									: null,
							notes: buildInvoiceNotes(invoice)?.trimStart() ?? "",
						},
					};
				});

				const hasValid = updated.some(
					(e) => filesToProcess.some((p) => p.id === e.id) && e.status === "success"
				);

				if (hasValid) {
					setStep("review");
				} else {
					toast.error("Keine gültigen Rechnungen erkannt.");
				}

				return updated;
			});
		},
	});

	const saveMutation = useMutation({
		mutationFn: async () => {
			const valid = entries.filter((e) => e.status === "success" && e.result);

			if (!valid.length)
				throw new Error("Keine gültigen Rechnungen vorhanden.");

			const errors: string[] = [];

			for (const entry of valid) {
				const { file, result } = entry;
				if (!result) continue;

				const payload = {
					invoice_date: result.invoiceDate,
					total_amount: result.amount,
					service_period: false,
					for_all_tenants: true,
					purpose: result.purpose,
					notes: result.notes,
					document: [file],
					direct_local_id: null,
				};

				try {
					const savedInvoice = await saveInvoiceAction(
						payload,
						objektId,
						docId,
						result.costType,
						userId,
					);

					updateDocumentGroup(result.costType, {
						...savedInvoice,
						document: [file],
					});

					await uploadDocuments.mutateAsync({
						relatedType: "heating_bill",
						files: [file],
						relatedId: docId,
					});

					// Update this specific entry to 'saved'
					setEntries((prev) =>
						prev.map((e) =>
							e.id === entry.id ? { ...e, status: "saved" } : e,
						),
					);
				} catch (err: any) {
					errors.push(
						`${file.name}: ${err.message || "Speichern fehlgeschlagen"}`,
					);
					// Mark this specific entry as error so user can see it
					setEntries((prev) =>
						prev.map((e) =>
							e.id === entry.id
								? { ...e, status: "error", error: err.message }
								: e,
						),
					);
				}
			}

			if (errors.length > 0) {
				if (errors.length < valid.length) {
					throw new Error(
						`Teilweiser Erfolg. ${errors.length} Dateien konnten nicht gespeichert werden:\n${errors.join("\n")}`,
					);
				} else {
					throw new Error(
						`Alle Speichervorgänge fehlgeschlagen:\n${errors.join("\n")}`,
					);
				}
			}
		},
		onSuccess: () => {
			toast.success("Alle Rechnungen erfolgreich gespeichert.");
			// Small delay to ensure the user can see the success toast and logs
			setTimeout(() => {
				router.push(nextLink);
			}, 500);
		},
		onError: (error: any) => {
			toast.error(error.message || "Fehler beim Speichern der Rechnungen.");
		},
	});

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const newEntries = acceptedFiles.map((file) => ({
			id: Math.random().toString(36).substring(7),
			file,
			status: "pending" as const,
		}));
		setEntries((prev) => [...prev, ...newEntries]);
	}, []);

	const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
		fileRejections.forEach((rejection) => {
			const { file, errors } = rejection;
			errors.forEach((error) => {
				if (error.code === "file-too-large") {
					toast.error(`${file.name} ist zu groß (max. 10 MB)`);
				} else if (error.code === "too-many-files") {
					toast.error(`Zu viele Dateien (max. 20)`);
				} else {
					toast.error(`${file.name}: ${error.message}`);
				}
			});
		});
	}, []);

	const submitMutation = useMutation({
		mutationFn: async () => {
			if (step === "upload") {
				const toAnalyze = entries.filter(
					(e) => e.status === "pending" || e.status === "error",
				);
				if (toAnalyze.length > 0) {
					setEntries((prev) =>
						prev.map((e) =>
							toAnalyze.some((p) => p.id === e.id)
								? { ...e, status: "analyzing" }
								: e,
						),
					);
					await parseMutation.mutateAsync(toAnalyze);
				} else {
					router.push(nextLink);
				}
				return;
			}

			if (step === "review") {
				const toSave = entries.filter((e) => e.status === "success");
				if (toSave.length > 0) {
					await saveMutation.mutateAsync();
				} else {
					router.push(nextLink);
				}
			}
		},
	});

	const handleSubmit = () => {
		submitMutation.mutate();
	};

	const isSubmitDisabled =
		(entries.length === 0 && !isEditMode) ||
		(entries.length > 0 && entries.every((e) => e.status === "error")) ||
		(step === "review" && !entries.some((e) => e.status === "success"));

	return {
		entries,
		setEntries,
		step,
		setStep,
		onDrop,
		onDropRejected,
		handleSubmit,
		parseMutation,
		saveMutation,
		submitMutation,
		nextLink,
		isSubmitDisabled,
	};
}
