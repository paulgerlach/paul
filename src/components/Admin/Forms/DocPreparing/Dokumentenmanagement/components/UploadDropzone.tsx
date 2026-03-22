"use client";

import Image from "next/image";
import { FileRejection, useDropzone } from "react-dropzone";
import { ai_starts } from "@/static/icons";
import Link from "next/link";
import { ROUTE_ADMIN, ROUTE_DOKUMENTE } from "@/routes/routes";
import { useParams, usePathname } from "next/navigation";

interface UploadDropzoneProps {
    onDrop: (acceptedFiles: File[]) => void;
    onDropRejected?: (fileRejections: FileRejection[]) => void;
}

export function UploadDropzone({ onDrop, onDropRejected }: UploadDropzoneProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        accept: { "application/pdf": [".pdf"] },
        multiple: true,
        maxSize: 10 * 1024 * 1024,   // 10 MB per file
        maxFiles: 20,                 // max 20 files per batch
    });

    const pathname = usePathname();
    const params = useParams();

    const isAdmin = pathname.includes("admin");

    return (
        <>
            <div
                {...getRootProps()}
                className="border-2 flex-1 border-dashed border-ai-blue rounded-xl p-10 text-center cursor-pointer flex items-center justify-center flex-col max-w-"
            >
                <input {...getInputProps()} />
                <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-[72px] mb-10 max-h-[69px] block mx-auto"
                    src={ai_starts}
                    alt="ai_starts"
                />
                <p className="text-admin_dark_text max-w-[260px] mx-auto text-center font-bold">
                    {isDragActive
                        ? "Dateien hier ablegen…"
                        : (
                            <>
                                Drag & drop zum uploaden <span className="text-ai-blue font-bold">oder durchsuchen</span>
                            </>
                        )}
                </p>
            </div>
            <p className="mt-4 text-[#757575] text-sm">
                Unbegrenztes Hochladen von <Link className="text-ai-blue font-bold" href={isAdmin ? `${ROUTE_ADMIN}/${params.user_id}${ROUTE_DOKUMENTE}` : ROUTE_DOKUMENTE}>Dokumenten</Link> mit einer Dateigröße von bis zu 500 MB.
            </p>
        </>
    );
}
