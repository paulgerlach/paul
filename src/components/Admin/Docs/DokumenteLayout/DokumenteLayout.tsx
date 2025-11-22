"use client";

import { useEffect, useState, useMemo } from "react";
import { useDocumentService, DocumentMetadata } from "@/hooks/useDocumentService";
import { pdf_icon, building } from "@/static/icons";
import { toast } from "sonner";
import Image from "next/image";
import { Exo_2 } from "next/font/google";
import { useDialogStore } from "@/store/useDIalogStore";
import { Trash2, Eye, FolderOpen } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

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
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  const {
    getDocumentFileSize,
    getDownloadUrl,
    getViewUrl,
  } = useDocumentService();
  
  const { setItemID, openDialog } = useDialogStore();
  const router = useRouter();
  const pathname = usePathname();

  // Detect if we're in admin context
  const isAdmin = pathname.startsWith('/admin');
  const adminUserId = isAdmin ? pathname.split('/')[2] : null;

  // Route mapping for different document types
  const DOCUMENT_SOURCE_ROUTES: Record<
    string,
    (doc: DocumentMetadata) => string | null
  > = {
    heating_bill: (doc) => {
      if (!doc.objekt_id || !doc.related_id) return null;
      
      const baseRoute = isAdmin 
        ? `/admin/${adminUserId}/heizkostenabrechnung` 
        : `/heizkostenabrechnung`;
      
      // If has local_id → apartment-level (localauswahl)
      if (doc.local_id) {
        return `${baseRoute}/localauswahl/${doc.objekt_id}/${doc.local_id}/${doc.related_id}/results`;
      }
      
      // No local_id → building-level (objektauswahl)
      return `${baseRoute}/objektauswahl/${doc.objekt_id}/${doc.related_id}/results`;
    },
    
    operating_costs: (doc) => {
      if (!doc.objekt_id || !doc.related_id) return null;
      
      const baseRoute = isAdmin 
        ? `/admin/${adminUserId}/betriebskostenabrechnung` 
        : `/betriebskostenabrechnung`;
      
      return `${baseRoute}/objektauswahl/${doc.objekt_id}/${doc.related_id}/results`;
    },
  };

  const handleGoToSource = (document: DocumentMetadata) => {
    const routeBuilder = DOCUMENT_SOURCE_ROUTES[document.related_type];
    
    if (!routeBuilder) {
      toast.info("Kein Quelldokument verfügbar");
      return;
    }
    
    const url = routeBuilder(document);
    
    if (!url) {
      toast.error("Unvollständige Dokumentdaten");
      return;
    }
    
    router.push(url);
  };

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

  // Group documents by type into folders
  const documentFolders = useMemo(() => {
    const grouped = filteredDocuments.reduce((acc, doc) => {
      const type = doc.related_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(doc);
      return acc;
    }, {} as Record<string, DocumentMetadata[]>);

    // Only show 2 folders: Heating bills and Operating costs
    return [
      {
        type: 'heating_bill',
        name: 'Heizkostenabrechnungen',
        icon: '🔥',
        documents: grouped['heating_bill'] || [],
        count: (grouped['heating_bill'] || []).length
      },
      {
        type: 'operating_costs',
        name: 'Betriebskostenabrechnungen',
        icon: '🏢',
        documents: grouped['operating_costs'] || [],
        count: (grouped['operating_costs'] || []).length
      }
    ];
  }, [filteredDocuments]);

  // Get documents for currently selected folder
  const currentFolderDocuments = useMemo(() => {
    if (!selectedFolder) return [];
    
    const folder = documentFolders.find(f => f.type === selectedFolder);
    return folder ? folder.documents : [];
  }, [selectedFolder, documentFolders]);

  // Folder navigation handlers
  const handleFolderDoubleClick = (folderType: string) => {
    setSelectedFolder(folderType);
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
  };

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
                  setSelectedFolder(null); // Reset folder view when changing building
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

        {/* Content Area */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {!selectedFolder ? (
            // FOLDER VIEW
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                {selectedObjekt === null 
                  ? "Dokumente"
                  : (() => {
                      const objekt = objektsToUse?.find(o => o.id === selectedObjekt);
                      return objekt ? getObjektDisplayName(objekt) : "Unbekanntes Objekt";
                    })()
                }
              </h2>
              
              {documentFolders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documentFolders.map(folder => (
                    <div
                      key={folder.type}
                      onDoubleClick={() => handleFolderDoubleClick(folder.type)}
                      className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-green hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-5xl group-hover:scale-110 transition-transform">
                          {folder.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-dark_green group-hover:text-green">
                            {folder.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {folder.count} {folder.count === 1 ? 'Dokument' : 'Dokumente'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
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
              )}
            </div>
          ) : (
            // FILES VIEW
            <div>
              {/* Back Button */}
              <button
                onClick={handleBackToFolders}
                className="mb-4 flex items-center gap-2 text-gray-600 hover:text-dark_green transition-colors"
              >
                <span>←</span>
                <span>Zurück zu Ordnern</span>
              </button>

              {/* Folder Header */}
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                {documentFolders.find(f => f.type === selectedFolder)?.name}
                <span className="text-gray-500 ml-2 text-lg">
                  ({currentFolderDocuments.length} {currentFolderDocuments.length === 1 ? 'Dokument' : 'Dokumente'})
                </span>
              </h2>

              {/* Documents Table */}
              <div className="overflow-auto">
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
                    {currentFolderDocuments.map((document: DocumentMetadata) => (
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
                              onClick={() => handleGoToSource(document)}
                              className="p-1.5 text-dark_green hover:bg-green/20 transition-all duration-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Zur Quelle gehen"
                              disabled={!DOCUMENT_SOURCE_ROUTES[document.related_type]}
                            >
                              <FolderOpen className="w-4 h-4" />
                            </button>
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
            </div>
          )}
        </div>

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
