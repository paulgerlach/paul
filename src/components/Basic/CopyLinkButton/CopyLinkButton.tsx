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
      className="max-medium:w-full cursor-pointer flex items-center justify-center gap-1.5 text-center w-fit py-2.5 max-medium:py-3 px-10 text-lg text-dark_text bg-green rounded-halfbase my-5 transition-all duration-300 hover:bg-green/80 active:bg-green/90 disabled:bg-green/50 disabled:cursor-not-allowed">
      <Image width={16} height={16} loading="lazy" src={link} alt="link" />
      {copied ? "Kopiert!" : "Link kopieren"}
    </button>
  );
}
