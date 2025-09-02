"use client";

import { useEffect, useState, useMemo } from "react";
import { useDocumentService, DocumentMetadata } from "@/hooks/useDocumentService";
import { useObjektsWithLocals } from "@/apiClient";
import { 
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";
import { pdf_icon } from "@/static/icons";
import { toast } from "sonner";
import Image from "next/image";
import { Exo_2 } from "next/font/google";

const exo2 = Exo_2({ subsets: ["latin"] });

interface Objekt {
  id: string;
  street: string;
  house_number: string;
  zip: string;
  city: string;
}

export default function DokumenteLayout() {
  const [fileSizes, setFileSizes] = useState<Record<string, string>>({});
  const [selectedObjekt, setSelectedObjekt] = useState<string | null>(null);
  
  const {
    documents,
    isLoading: documentsLoading,
    getDocumentFileSize,
    getDownloadUrl,
    refreshDocuments,
  } = useDocumentService();

  const { data: objekts, isLoading: objektsLoading } = useObjektsWithLocals();

  // Load documents on component mount
  useEffect(() => {
    console.log("Component mounted, calling refreshDocuments");
    refreshDocuments();
  }, [refreshDocuments]);

  // Auto-select the only objekt if there's just one
  useEffect(() => {
    if (objekts && objekts.length === 1) {
      setSelectedObjekt(objekts[0].id);
    }
  }, [objekts]);

  // Filter documents by selected objekt
  const filteredDocuments = useMemo(() => {
    if (!documents) return [];
    if (!selectedObjekt) return documents;
    return documents.filter(doc => doc.objekt_id === selectedObjekt);
  }, [documents, selectedObjekt]);

  // Fetch file sizes when documents change
  useEffect(() => {
    const fetchSizes = async () => {
      if (filteredDocuments && filteredDocuments.length > 0) {
        for (const doc of filteredDocuments) {
          const size = await getDocumentFileSize(doc.document_url);
          setFileSizes((prev: Record<string, string>) => ({
            ...prev,
            [doc.id]: size
          }));
        }
      }
    };
    fetchSizes();
  }, [filteredDocuments, getDocumentFileSize]);

  const handleDownload = async (document: DocumentMetadata) => {
    try {
      const downloadUrl = await getDownloadUrl(document.document_url);
      if (downloadUrl) {
        // Open in new tab instead of downloading
        window.open(downloadUrl, '_blank');
        toast.success("Dokument wird in neuem Tab geöffnet");
      }
    } catch (error) {
      toast.error("Fehler beim Öffnen des Dokuments");
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "vor weniger als 1 Stunde";
    } else if (diffInHours < 24) {
      return `vor ${diffInHours} Stunden`;
    } else {
      return date.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
  };

  const getObjektDisplayName = (objekt: Objekt): string => {
    return `${objekt.street} `;
  };

  if (documentsLoading || objektsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${exo2.className}`}>
      {/* Main Content */}
      <div className="bg-white rounded-lg flex-1 flex flex-col">
        {/* Property Navigation */}
        <div className="px-6 py-4">
          <div className="flex gap-3 overflow-x-auto">
            {objekts?.map((objekt) => (
              <button
                key={objekt.id}
                onClick={() => setSelectedObjekt(objekt.id)}
                className={`flex flex-col items-start gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedObjekt === objekt.id
                    ? "border-green bg-green-50 text-green-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <BuildingOfficeIcon className="h-10 w-10" />
                <span className="text-xs font-light whitespace-nowrap">
                  {getObjektDisplayName(objekt)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="px-6 pb-10 flex items-center justify-between">
          <h2 className="text-xl font-light text-gray-900">
            {selectedObjekt 
              ? (() => {
                  const objekt = objekts?.find(o => o.id === selectedObjekt);
                  return objekt ? getObjektDisplayName(objekt) : "Unbekanntes Objekt";
                })()
              : "Alle Dokumente"
            }
          </h2>
        </div>

        {/* Documents Table */}
        <div className="overflow-auto flex-1 min-h-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                  Geändert
                </th>
                <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                  Größe
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredDocuments.map((document: DocumentMetadata) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        loading="lazy"
                        className="max-w-6 max-h-6 mr-3"
                        src={pdf_icon}
                        alt="pdf_icon"
                      />
                      <button
                        onClick={() => handleDownload(document)}
                        className="text-sm font-light text-gray-900 hover:text-green-600 hover:underline cursor-pointer"
                      >
                        {document.document_name}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(document.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fileSizes[document.id] || '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="px-6 py-12 text-center flex-1 flex items-center justify-center">
            <div>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="mx-auto max-w-12 max-h-12 opacity-40"
                src={pdf_icon}
                alt="pdf_icon"
              />
              <h3 className="mt-2 text-sm font-light text-gray-900">Keine Dokumente</h3>
              <p className="mt-1 text-sm text-gray-500">
                Laden Sie Ihr erstes Dokument hoch, um zu beginnen.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Add Documents Button - Pinned at Bottom of Page */}
      <div className="flex justify-center mt-6">
        <button className="px-6 py-3 border-2 border-dashed border-blue-400 text-blue-600 rounded-lg hover:border-blue-500 hover:text-blue-700 transition-colors">
          Unterlagen hinzufügen
        </button>
      </div>
    </div>
  );
}
