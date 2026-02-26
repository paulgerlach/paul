"use client";

import Image from "next/image";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { ai_starts } from "@/static/icons";
import { ROUTE_DOKUMENTE } from "@/routes/routes";

interface UploadDropzoneProps {
    onDrop: (acceptedFiles: File[]) => void;
}

export function UploadDropzone({ onDrop }: UploadDropzoneProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        multiple: true,
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
                Unbegrenztes Hochladen von <Link href={ROUTE_DOKUMENTE} className="font-bold text-ai-blue">Dokumenten</Link> mit einer Dateigröße von bis zu 500 MB.
            </p>
        </>
    );
}
