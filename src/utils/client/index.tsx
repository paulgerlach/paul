"use client";

import { RefObject, useEffect } from "react";

export const useClickOutside = (
  ref: RefObject<HTMLDivElement | null>,
  onClickOutside: () => void
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
};

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
