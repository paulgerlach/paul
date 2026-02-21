"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../../ui/DialogBase";
import { Button } from "../../ui/Button";
import { useHeizkostenabrechnungStore } from "@/store/useHeizkostenabrechnungStore";
import { toast } from "sonner";
import { useUploadDocuments } from "@/apiClient";
import { createHeatingInvoice } from "@/actions/create/createHeatingInvoice";
import { useCallback, useMemo, useState } from "react";
import {
  buildInvoiceNotes,
  mapCostCategoryToPurpose,
  processInvoicesViaNext,
} from "@/api/invoices";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { parse } from "date-fns";
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { adminCreateHeatingInvoiceDocument } from "@/actions/create/admin/adminCreateHeatingInvoiceDocument";
import { useParams } from "next/navigation";

// ─── types ────────────────────────────────────────────────────────────────────

type FileEntry = {
  id: string;
  file: File;
  status: "pending" | "analyzing" | "success" | "error";
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

type DialogStep = "upload" | "review";

// ─── component ────────────────────────────────────────────────────────────────

export default function AdminAddDocHeizkostenabrechnungAIDialog() {
  const { openDialogByType, closeDialog } = useDialogStore();
  const {
    documentGroups,
    updateDocumentGroup,
    objektID,
    operatingDocID,
  } = useHeizkostenabrechnungStore();

  const uploadDocuments = useUploadDocuments();
  const { user_id } = useParams();

  const isOpen = openDialogByType.admin_ai_invoice_create;

  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [step, setStep] = useState<DialogStep>("upload");

  // ─── all available purpose options (across all groups) ───────────────────────
  const allPurposeOptions = useMemo(
    () => documentGroups.flatMap((g) => g.options ?? []),
    [documentGroups]
  );

  // ─── mutation ────────────────────────────────────────────────────────────────
  const parseMutation = useMutation({
    mutationFn: async (filesToProcess: FileEntry[]) => {
      const results = await processInvoicesViaNext(filesToProcess.map(e => e.file));
      return { results, filesToProcess };
    },
    onSuccess: (data) => {
      const { results, filesToProcess } = data;

      setEntries((prev) =>
        prev.map((entry) => {
          const processed = filesToProcess.find((f) => f.id === entry.id);
          if (!processed) return entry;

          const index = filesToProcess.indexOf(processed);
          const invoice = results.invoices?.[index];

          if (!invoice) {
            return { ...entry, status: "error" as const, error: "Keine Rechnungsdaten erkannt." };
          }

          const mappedPurpose = mapCostCategoryToPurpose(
            invoice.cost_category,
            allPurposeOptions
          );

          if (!mappedPurpose) {
            return {
              ...entry,
              status: "error" as const,
              error: invoice.cost_category
                ? `Kostenart „${invoice.cost_category}" keiner Kostenkategorie zugeordnet.`
                : "Kostenart konnte nicht erkannt werden - Rechnung ungültig.",
            };
          }

          const group = documentGroups.find((g) => g.options?.includes(mappedPurpose));

          if (!group?.type) {
            return {
              ...entry,
              status: "error" as const,
              error: "Zugehörige Kostenkategorie nicht gefunden.",
            };
          }

          let invoiceDate: Date | null = null;
          if (invoice.invoice_date) {
            const d = parse(invoice.invoice_date, "dd.MM.yyyy", new Date());
            if (!isNaN(d.getTime())) invoiceDate = d;
          }

          const amount = typeof invoice.gross_amount === "number" ? invoice.gross_amount : null;
          const notes = buildInvoiceNotes(invoice);

          return {
            ...entry,
            status: "success" as const,
            result: {
              costType: group.type,
              costTypeName: group.name ?? "Unbekannt",
              purpose: mappedPurpose,
              invoiceDate,
              amount,
              notes: notes?.trimStart() ?? "",
            },
          };
        })
      );

      setStep("review");
    },
    onError: (e: any, filesToProcess) => {
      const errorMsg = e?.message || "Fehler beim Verarbeiten der Rechnungen.";
      setEntries((prev) =>
        prev.map((entry) =>
          filesToProcess.some((f) => f.id === entry.id)
            ? { ...entry, status: "error" as const, error: errorMsg }
            : entry
        )
      );
      toast.error(errorMsg);
    },
  });

  // ─── save mutation ────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      const validEntries = entries.filter((e) => e.status === "success" && e.result);
      if (validEntries.length === 0) throw new Error("Keine gültigen Rechnungen zum Speichern.");

      for (const entry of validEntries) {
        const { file, result } = entry;
        if (!result) continue;

        const { costType, purpose, invoiceDate, amount, notes } = result;

        const formPayload = {
          invoice_date: invoiceDate,
          total_amount: amount,
          service_period: false,
          for_all_tenants: true,
          purpose,
          notes,
          document: [file],
          direct_local_id: null,
        };

        await adminCreateHeatingInvoiceDocument(
          formPayload,
          objektID,
          String(user_id),
          operatingDocID,
          costType
        );

        updateDocumentGroup(costType, {
          ...formPayload,
          invoice_date: invoiceDate ? invoiceDate.toISOString() : null,
          total_amount: amount != null ? String(amount) : null,
        });

        await uploadDocuments.mutateAsync({
          files: [file],
          relatedId: operatingDocID ?? "",
          relatedType: "heating_bill",
        });
      }
    },
    onSuccess: () => {
      toast.success("Alle Rechnungen erfolgreich zugeordnet und gespeichert.");
      handleClose();
    },
    onError: (e: any) => {
      toast.error(e?.message || "Fehler beim Speichern der Rechnungen.");
    },
  });

  // ─── dropzone ────────────────────────────────────────────────────────────────
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newEntries: FileEntry[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        status: "pending",
      }));
      setEntries((prev) => [...prev, ...newEntries]);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    disabled: parseMutation.isPending || saveMutation.isPending,
  });

  // ─── helpers ─────────────────────────────────────────────────────────────────
  const handleClose = () => {
    closeDialog("admin_ai_invoice_create");
    setEntries([]);
    setStep("upload");
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const startAnalysis = () => {
    const pending = entries.filter((e) => e.status === "pending" || e.status === "error");
    if (pending.length === 0) return;

    setEntries((prev) =>
      prev.map((e) =>
        pending.some((p) => p.id === e.id) ? { ...e, status: "analyzing" } : e
      )
    );
    parseMutation.mutate(pending);
  };

  if (!isOpen) return null;

  const isAnalyzing = parseMutation.isPending;
  const isSaving = saveMutation.isPending;
  const hasPending = entries.some((e) => e.status === "pending" || e.status === "error");
  const hasSuccess = entries.some((e) => e.status === "success");

  return (
    <DialogBase dialogName={"admin_ai_invoice_create"}>
      <p className="font-bold text-lg text-admin_dark_text -mt-6">
        Rechnungen automatisch zuordnen
      </p>

      <div className="flex flex-col gap-6">
        {step === "upload" ? (
          <>
            {/* ── Dropzone ── */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center gap-3 ${isDragActive
                ? "border-green-500 bg-green-50"
                : "border-black/20 hover:border-black/40 hover:bg-gray-50"
                } ${isAnalyzing ? "opacity-50 pointer-events-none" : ""}`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-10 h-10 text-black/30" />
              <p className="text-admin_dark_text font-medium">
                {isDragActive ? "Dateien hier ablegen…" : "Rechnungen hochladen"}
              </p>
              <p className="text-sm text-[#757575]">
                PDF-Dateien hier ablegen oder klicken zum Auswählen
              </p>
            </div>

            {/* ── File List ── */}
            {entries.length > 0 && (
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${entry.status === "error"
                      ? "bg-red-50 border-red-100"
                      : "bg-gray-50 border-black/5"
                      }`}
                  >
                    <FileText className={`w-5 h-5 ${entry.status === "error" ? "text-red-500" : "text-black/40"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-admin_dark_text truncate">
                        {entry.file.name}
                      </p>
                      {entry.status === "error" && (
                        <p className="text-xs text-red-600 truncate">{entry.error}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {entry.status === "analyzing" && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/10 border-t-black/60" />
                      )}
                      {entry.status === "success" && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      {entry.status === "pending" && (
                        <span className="text-[10px] font-bold text-black/30 uppercase">Wartend</span>
                      )}
                      {!isAnalyzing && (
                        <button
                          onClick={() => removeEntry(entry.id)}
                          className="p-1 hover:bg-black/5 rounded-full transition-colors"
                        >
                          <X size={14} className="text-black/40" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* ── Review Step ── */
          <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
            {entries.filter(e => e.status === "success").map((entry) => (
              <div key={entry.id} className="rounded-xl border border-green-200 bg-green-50 p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-800 truncate">{entry.file.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="text-green-600 hover:text-green-800 transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[13px]">
                  <div className="bg-white rounded-lg px-3 py-1.5 border border-green-100 col-span-2">
                    <p className="text-[#757575] text-[10px] mb-0.5 uppercase font-bold">Kostenkategorie</p>
                    <p className="font-medium text-admin_dark_text">{entry.result?.costTypeName}</p>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-1.5 border border-green-100">
                    <p className="text-[#757575] text-[10px] mb-0.5 uppercase font-bold">Verwendungszweck</p>
                    <p className="font-medium text-admin_dark_text truncate">{entry.result?.purpose}</p>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-1.5 border border-green-100">
                    <p className="text-[#757575] text-[10px] mb-0.5 uppercase font-bold">Gesamtbetrag</p>
                    <p className="font-medium text-admin_dark_text">
                      {entry.result?.amount?.toLocaleString("de-DE", { style: "currency", currency: "EUR" }) ?? "–"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() => setStep("upload")}
              className="!border-dashed !border-black/20 !bg-transparent hover:!bg-black/5"
            >
              + Weitere Rechnungen hinzufügen
            </Button>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving || isAnalyzing}
            className="!font-medium !text-lg max-xl:!text-sm !bg-white !border-black/20 !text-admin_dark_text hover:!bg-gray-100 hover:!text-admin_dark_text"
            onClick={handleClose}
          >
            Abbrechen
          </Button>

          {step === "upload" ? (
            <Button
              type="button"
              disabled={!hasPending || isAnalyzing}
              className="!font-medium !text-lg max-xl:!text-sm min-w-[160px]"
              onClick={startAnalysis}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analysieren…
                </span>
              ) : (
                `Analysieren (${entries.filter(e => e.status === "pending" || e.status === "error").length})`
              )}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!hasSuccess || isSaving}
              className="!font-medium !text-lg max-xl:!text-sm min-w-[160px]"
              onClick={() => saveMutation.mutate()}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Speichern…
                </span>
              ) : (
                `Alle Speichern (${entries.filter(e => e.status === "success").length})`
              )}
            </Button>
          )}
        </div>
      </div>
    </DialogBase>
  );
}
