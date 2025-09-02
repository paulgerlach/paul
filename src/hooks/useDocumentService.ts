import { useState, useCallback } from "react";
import { DocumentService, DocumentMetadata } from "@/services/documentService";
import { getDocumentDownloadUrl } from "@/apiClient";
import { toast } from "sonner";

export type { DocumentMetadata } from "@/services/documentService";

export const useDocumentService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [stats, setStats] = useState<{
    totalDocuments: number;
    documentsByType: Record<string, number>;
    totalSize: number;
  } | null>(null);


  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const docs = await DocumentService.getUserDocuments();
      setDocuments(docs);
      return docs;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fehler beim Laden der Dokumente";
      toast.error(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDocumentsByType = useCallback(async (documentType: string) => {
    setIsLoading(true);
    try {
      const docs = await DocumentService.getUserDocumentsByType(documentType);
      setDocuments(docs);
      return docs;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fehler beim Laden der Dokumente";
      toast.error(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);


  const refreshDocuments = useCallback(async () => {
    return fetchDocuments();
  }, [fetchDocuments]);

  const getDownloadUrl = useCallback(async (documentPath: string): Promise<string | null> => {
    try {
      return await getDocumentDownloadUrl(documentPath);
    } catch (error) {
      console.error("Error getting download URL:", error);
      return null;
    }
  }, []);

  const getDocumentFileSize = useCallback(async (documentPath: string): Promise<string> => {
    try {
      return await DocumentService.getDocumentFileSize(documentPath);
    } catch (error) {
      return '--';
    }
  }, []);


  return {
    isLoading,
    documents,
    stats,
     
    fetchDocuments,
    fetchDocumentsByType,
    refreshDocuments,
    getDownloadUrl,
    getDocumentFileSize,
  };
};
