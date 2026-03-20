"use client";

import { FileText, CheckCircle2, Loader2 } from "lucide-react";
import type { FileEntry } from "@/hooks/useInvoicesBase";

interface FileListProps {
    entries: FileEntry[];
}

export function FileList({ entries }: FileListProps) {
    if (entries.length === 0) return null;

    return (
        <div className="space-y-3 mt-6">
            {entries.map((entry) => (
                <div
                    key={entry.id}
                    className="flex items-center gap-3"
                >
                    <FileText />
                    {entry.file.name}
                    {(entry.status === "success" || entry.status === "saved") && (
                        <CheckCircle2 className="text-green-500" />
                    )}
                    {entry.status === "error" && (
                        <span className="text-red-500">
                            {entry.error}
                        </span>
                    )}
                    {entry.status === "analyzing" && (
                        <Loader2 className="animate-spin text-ai-blue h-5 w-5" />
                    )}
                </div>
            ))}
        </div>
    );
}
