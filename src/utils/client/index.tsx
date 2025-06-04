"use client";

import { UploadedDocument } from "@/types";
import { RefObject, useEffect, useState } from "react";

export const useClickOutside = (
  ref: RefObject<HTMLDivElement | null>,
  onClickOutside: () => void
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
};

export function sanitizeFileName(fileName: string): string {
  const extension = fileName.includes(".")
    ? "." + fileName.split(".").pop()
    : "";

  const base = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9\-_\.]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 100);

  return `${base}${extension}`;
}

export function useDocumentDeletion(initialDocuments: UploadedDocument[] = []) {
  const [deletedDocumentIds, setDeletedDocumentIds] = useState<string[]>([]);
  const [existingDocuments, setExistingDocuments] =
    useState<UploadedDocument[]>(initialDocuments);

  const undoRemoveExistingFile = (id: string, file: UploadedDocument) => {
    setDeletedDocumentIds((prev) => prev.filter((d) => d !== id));
    setExistingDocuments((prev) => [...prev, file]);
  };

  const handleRemoveExistingFile = (id: string) => {
    setDeletedDocumentIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  return {
    existingDocuments,
    deletedDocumentIds,
    handleRemoveExistingFile,
    undoRemoveExistingFile,
  };
}
