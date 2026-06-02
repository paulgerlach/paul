"use client";

import Image from "next/image";
import { login } from "@/static/icons";

interface LoginDropdownProps {
  className?: string;
  isMobile?: boolean;
}

export default function LoginDropdown({ className = "", isMobile = false }: LoginDropdownProps) {

  if (isMobile) {
    return (
      <a
        href="https://platform.heidisystems.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-4 flex items-center gap-2 justify-center text-lg text-dark_text bg-white border-2 border-green rounded-halfbase min-h-12 hover:opacity-80 transition"
      >
        <Image
          width={20}
          height={20}
          loading="lazy"
          className="max-w-5 max-h-5"
          style={{ width: "100%", height: "auto" }}
          src={login}
          alt="login"
        />
        Einloggen
      </a>
    );
  }

  // Desktop version - direct link
  return (
    <a
      href="https://platform.heidisystems.com/"
      target="_blank"
      rel="noopener noreferrer"
      className={`p-2 flex items-center gap-1.5 justify-center text-base max-xl:text-sm text-dark_text hover:opacity-80 transition ${className}`}
    >
      <Image
        width={16}
        height={16}
        loading="lazy"
        className="max-w-4 max-h-4"
        style={{ width: "100%", height: "auto" }}
        src={login}
        alt="login"
      />
      Einloggen
    </a>
  );
}
