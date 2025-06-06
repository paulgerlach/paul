"use client";

import type { UploadedDocument } from "@/types";
import { useState } from "react";

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
