"use client";

import { useEffect, useState, useMemo } from "react";
import { useDocumentService, DocumentMetadata } from "@/hooks/useDocumentService";
import { pdf_icon, building } from "@/static/icons";
import { toast } from "sonner";
import Image from "next/image";
import { Exo_2 } from "next/font/google";
import { useDialogStore } from "@/store/useDIalogStore";
import { Trash2, Eye } from "lucide-react";

const exo2 = Exo_2({ subsets: ["latin"] });

interface Objekt {
  id: string;
  street: string;
  house_number: string;
  zip: string;
  city: string;
}

interface ObjektWithLocals {
  id?: string;
  user_id: string;
  objekt_type: string;
  street: string;
  zip: string;
  administration_type: string;
  hot_water_preparation: string;
  living_area?: number;
  usable_area?: number;
  land_area?: number;
  build_year?: number;
  has_elevator: boolean;
  tags?: any;
  heating_systems?: any;
  created_at?: string;
  image_url?: string;
  locals: any[];
}

interface DokumenteLayoutProps {
  userId?: string;
  objektsWithLocals: ObjektWithLocals[];
  documents: any[]; 
}

export default function DokumenteLayout({ userId, objektsWithLocals, documents: serverDocuments }: DokumenteLayoutProps) {
  const [fileSizes, setFileSizes] = useState<Record<string, string>>({});
  const [selectedObjekt, setSelectedObjekt] = useState<string | null>(null);
  
  const {
    getDocumentFileSize,
    getDownloadUrl,
    getViewUrl,
  } = useDocumentService();
  
  const { setItemID, openDialog } = useDialogStore();

  const handleDeleteClick = (documentId: string) => {
    setItemID(documentId);
    openDialog("document_delete");
  };

  const handleViewClick = async (document: DocumentMetadata) => {
    const viewUrl = await getViewUrl(document.document_url);
    if (viewUrl) {
      window.open(viewUrl, '_blank');
    } else {
      toast.error("Fehler beim Öffnen des Dokuments");
    }
  };
  
  const documents = serverDocuments;
  const documentsLoading = false;

  const objektsToUse = useMemo(() => objektsWithLocals || [], [objektsWithLocals]);
  const isLoadingObjekts = false;

  const filteredDocuments = useMemo(() => {
    if (!documents) return [];
    if (!selectedObjekt) return documents;
    return documents.filter(doc => doc.objekt_id === selectedObjekt);
  }, [documents, selectedObjekt]);

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

  const getObjektDisplayName = (objekt: ObjektWithLocals): string => {
    return `${objekt.street}`;
  };

  if (documentsLoading || isLoadingObjekts) {
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
            {objektsToUse?.map((objekt) => (
              <button
                key={objekt.id}
                onClick={() => {
                  if (selectedObjekt === objekt.id) {
                    setSelectedObjekt(null);
                  } else {
                    setSelectedObjekt(objekt.id || null);
                  }
                }}
                className={`flex flex-col items-start gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedObjekt === objekt.id
                    ? "border-green bg-green-50 text-green-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <Image
                  width={40}
                  height={40}
                  src={building}
                  alt="building"
                  className={`h-10 w-10 transition-all ${
                    selectedObjekt === objekt.id
                      ? "filter brightness-0" // Black when selected
                      : "filter brightness-0 opacity-40" // Gray when not selected
                  }`}
                />
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
            {selectedObjekt === null 
              ? "Alle Dokumente"
              : (() => {
                  const objekt = objektsToUse?.find(o => o.id === selectedObjekt);
                  return objekt ? getObjektDisplayName(objekt) : "Unbekanntes Objekt";
                })()
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
                <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                  Aktionen
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewClick(document)}
                        className="p-1.5 text-dark_green hover:bg-green/20 transition-all duration-300 rounded-md"
                        title="Dokument anzeigen"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(document.id)}
                        className="p-1.5 text-dark_green hover:bg-green/20 transition-all duration-300 rounded-md"
                        title="Dokument löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
