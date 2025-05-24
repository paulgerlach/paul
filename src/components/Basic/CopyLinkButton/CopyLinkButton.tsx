"use client";

import { link } from "@/static/icons";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function CopyLinkButton() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}${pathname}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Fehler beim Kopieren: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={copied}
      type="button"
      className="min-w-28 blogImageCopyLink cursor-pointer flex items-center justify-start gap-1.5 text-center w-fit text-xs font-medium bg-green/30 rounded-full px-2 py-1 mr-2 text-dark_text my-5 max-medium:my-0 max-medium:mr-0 max-medium:ml-auto transition-all duration-300 hover:bg-green/80 active:bg-green/90 disabled:bg-green/50 disabled:cursor-not-allowed">
      <Image width={16} height={16} loading="lazy" src={link} alt="link" />
      {copied ? "Kopiert!" : "Link kopieren"}
    </button>
  );
}
