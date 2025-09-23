"use client";

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
