"use client";

import Image from "next/image";
import { FileRejection, useDropzone } from "react-dropzone";
import { ai_starts } from "@/static/icons";

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

    return (
        <>
            <div
                {...getRootProps()}
                className="border-2 flex-1 border-dashed border-ai-blue rounded-xl p-10 text-center cursor-pointer flex items-center justify-center flex-col"
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
                Maximal 20 Dateien pro Upload, bis zu 10 MB pro PDF-Datei.
            </p>
        </>
    );
}
