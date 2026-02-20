"use client";

import { useDialogStore } from "@/store/useDIalogStore";
import DialogBase from "../ui/DialogBase";
import { DialogStoreActionType } from "@/types";
import { Button } from "../ui/Button";
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

// ─── types ────────────────────────────────────────────────────────────────────

type InvoiceStatus =
  | { kind: "idle" }
  | { kind: "processing" }
  | { kind: "valid"; file: File; costType: string; purpose: string; invoiceDate: Date | null; amount: number | null; notes: string }
  | { kind: "invalid"; file: File; reason: string };

// ─── component ────────────────────────────────────────────────────────────────

export default function AddDocHeizkostenabrechnungAIDialog() {
  const { openDialogByType, closeDialog } = useDialogStore();
  const {
    documentGroups,
    updateDocumentGroup,
    objektID,
    operatingDocID,
  } = useHeizkostenabrechnungStore();

  const uploadDocuments = useUploadDocuments();

  const activeDialog = useMemo(() => {
    return Object.entries(openDialogByType).find(
      ([key, value]) =>
        key.endsWith("_heizkostenabrechnung_upload") &&
        value === true &&
        !key.includes("admin_")
    )?.[0];
  }, [openDialogByType]);

  const isOpen = Boolean(activeDialog);

  const [status, setStatus] = useState<InvoiceStatus>({ kind: "idle" });

  // ─── find cost type group by purpose ────────────────────────────────────────
  const findCostTypeByPurpose = useCallback(
    (purpose: string): string | null => {
      const group = documentGroups.find((g) =>
        g.options?.includes(purpose)
      );
      return group?.type ?? null;
    },
    [documentGroups]
  );

  // ─── all available purpose options (across all groups) ───────────────────────
  const allPurposeOptions = useMemo(
    () => documentGroups.flatMap((g) => g.options ?? []),
    [documentGroups]
  );

  // ─── mutation ────────────────────────────────────────────────────────────────
  const parseMutation = useMutation({
    mutationFn: async (file: File) => processInvoicesViaNext([file]),
    onSuccess: (result, file) => {
      const invoice = result.invoices?.[0];
      if (!invoice) {
        setStatus({ kind: "invalid", file, reason: "Keine Rechnungsdaten erkannt." });
        return;
      }

      const mappedPurpose = mapCostCategoryToPurpose(
        invoice.cost_category,
        allPurposeOptions
      );

      if (!mappedPurpose) {
        setStatus({
          kind: "invalid",
          file,
          reason:
            invoice.cost_category
              ? `Kostenart „${invoice.cost_category}" keiner Kostenkategorie zugeordnet.`
              : "Kostenart konnte nicht erkannt werden – Rechnung ungültig.",
        });
        return;
      }

      const costType = findCostTypeByPurpose(mappedPurpose);
      if (!costType) {
        setStatus({
          kind: "invalid",
          file,
          reason: "Zugehörige Kostenkategorie nicht gefunden.",
        });
        return;
      }

      let invoiceDate: Date | null = null;
      if (invoice.invoice_date) {
        const d = parse(invoice.invoice_date, "dd.MM.yyyy", new Date());
        if (!isNaN(d.getTime())) invoiceDate = d;
      }

      const amount =
        typeof invoice.gross_amount === "number" ? invoice.gross_amount : null;

      const notes = buildInvoiceNotes(invoice);

      setStatus({
        kind: "valid",
        file,
        costType,
        purpose: mappedPurpose,
        invoiceDate,
        amount,
        notes: notes?.trimStart() ?? "",
      });
    },
    onError: (e: any, file) => {
      setStatus({
        kind: "invalid",
        file,
        reason: e?.message || "Fehler beim Verarbeiten der Rechnung.",
      });
    },
  });

  // ─── save mutation ────────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (status.kind !== "valid") throw new Error("Keine gültige Rechnung.");

      const { file, costType, purpose, invoiceDate, amount, notes } = status;

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

      await createHeatingInvoice(
        formPayload,
        objektID,
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
    },
    onSuccess: () => {
      toast.success("Rechnung erfolgreich zugeordnet und gespeichert.");
      handleClose();
    },
    onError: (e: any) => {
      toast.error(e?.message || "Fehler beim Speichern der Rechnung.");
    },
  });

  // ─── dropzone ────────────────────────────────────────────────────────────────
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setStatus({ kind: "processing" });
      parseMutation.mutate(file);
    },
    [parseMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled: status.kind === "processing" || saveMutation.isPending,
  });

  // ─── helpers ─────────────────────────────────────────────────────────────────
  const handleClose = () => {
    if (activeDialog) closeDialog(activeDialog as DialogStoreActionType);
    setStatus({ kind: "idle" });
  };

  const handleReset = () => setStatus({ kind: "idle" });

  if (!isOpen) return null;

  const isProcessing = status.kind === "processing";
  const isSaving = saveMutation.isPending;
  const canSave = status.kind === "valid" && !isSaving;

  return (
    <DialogBase dialogName={activeDialog as DialogStoreActionType}>
      <p className="font-bold text-lg text-admin_dark_text -mt-6">
        Rechnung automatisch zuordnen
      </p>

      <div className="flex flex-col gap-6">
        {/* ── Dropzone ── */}
        {status.kind === "idle" && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center gap-3 ${isDragActive
                ? "border-green-500 bg-green-50"
                : "border-black/20 hover:border-black/40 hover:bg-gray-50"
              }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-10 h-10 text-black/30" />
            <p className="text-admin_dark_text font-medium">
              {isDragActive ? "Datei hier ablegen…" : "Rechnung hochladen"}
            </p>
            <p className="text-sm text-[#757575]">
              PDF-Datei hier ablegen oder klicken zum Auswählen
            </p>
          </div>
        )}

        {/* ── Processing ── */}
        {isProcessing && (
          <div className="border-2 border-dashed rounded-xl p-10 text-center flex flex-col items-center gap-4 border-black/20 bg-gray-50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black/60" />
            <p className="text-admin_dark_text font-medium">
              Rechnung wird analysiert…
            </p>
            <p className="text-sm text-[#757575]">
              KI erkennt Kostenart und Rechnungsdaten
            </p>
          </div>
        )}

        {/* ── Valid result ── */}
        {status.kind === "valid" && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-green-800">Rechnung erkannt</p>
                <p className="text-sm text-green-700 truncate mt-0.5">
                  {status.file.name}
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-green-600 hover:text-green-800 transition-colors shrink-0"
                aria-label="Zurücksetzen"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg px-3 py-2 border border-green-100">
                <p className="text-[#757575] text-xs mb-0.5">Kostenkategorie</p>
                <p className="font-medium text-admin_dark_text truncate">
                  {status.purpose}
                </p>
              </div>
              {status.amount != null && (
                <div className="bg-white rounded-lg px-3 py-2 border border-green-100">
                  <p className="text-[#757575] text-xs mb-0.5">Gesamtbetrag</p>
                  <p className="font-medium text-admin_dark_text">
                    {status.amount.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>
              )}
              {status.invoiceDate && (
                <div className="bg-white rounded-lg px-3 py-2 border border-green-100">
                  <p className="text-[#757575] text-xs mb-0.5">Rechnungsdatum</p>
                  <p className="font-medium text-admin_dark_text">
                    {status.invoiceDate.toLocaleDateString("de-DE")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Invalid result ── */}
        {status.kind === "invalid" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-800">Rechnung ungültig</p>
                <p className="text-sm text-red-700 mt-0.5">{status.reason}</p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                aria-label="Zurücksetzen"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-red-600 bg-white rounded-lg px-3 py-2 border border-red-100">
              <FileText size={14} className="shrink-0" />
              <span className="truncate">{status.file.name}</span>
            </div>

            {/* Re-upload area */}
            <div
              {...getRootProps()}
              className="border border-dashed border-red-300 rounded-lg p-3 text-center cursor-pointer hover:bg-red-100/50 transition-colors"
            >
              <input {...getInputProps()} />
              <p className="text-sm text-red-600">
                Andere Datei hochladen
              </p>
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            className="!font-medium !text-lg max-xl:!text-sm !bg-white !border-black/20 !text-admin_dark_text hover:!bg-gray-100 hover:!text-admin_dark_text"
            onClick={handleClose}
          >
            Abbrechen
          </Button>

          <Button
            type="button"
            disabled={!canSave}
            className="!font-medium !text-lg max-xl:!text-sm"
            onClick={() => saveMutation.mutate()}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Speichern…
              </span>
            ) : (
              "Speichern"
            )}
          </Button>
        </div>
      </div>
    </DialogBase>
  );
}
