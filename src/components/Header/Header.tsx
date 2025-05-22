"use client";

import Link from "next/link";
import HeaderButton from "./HeaderButton";
import Image from "next/image";
import { logo } from "@/static/icons";
import { ROUTE_FRAGEBOGEN, ROUTE_HOME, ROUTE_KONTAKT } from "@/routes/routes";
import Nav from "./Nav";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;

      const totalHeight = headerRef.current.clientHeight + 250;
      setScrolled(window.scrollY >= totalHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => {
    const dialog: HTMLDialogElement | null = document.getElementById(
      "login-dialog"
    ) as HTMLDialogElement | null;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleRegisterClick = () => {
    const dialog: HTMLDialogElement | null = document.getElementById(
      "register-dialog"
    ) as HTMLDialogElement | null;
    if (dialog) {
      dialog.showModal();
    }
  };

  return (
    <header
      id="header"
      ref={headerRef}
      className={`sticky w-full top-0 duration-300 ${
        scrolled ? "scrolled" : ""
      }`}>
      <div className="flex items-center bg-dark_green w-full px-10 max-medium:px-5 duration-300 max-large:[.scrolled_&]:py-3 max-large:py-4 ease-in-out justify-between">
        <Link
          href={ROUTE_HOME}
          className="flex items-center max-w-16 w-full h-5 justify-start gap-3">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            style={{ width: "100%", height: "auto" }}
            className="max-w-16 w-full h-5"
            src={logo}
            alt="logo"
          />
        </Link>
        <div className="flex-grow flex items-center justify-end max-large:fixed max-large:flex-col max-large:w-screen max-large:h-screen max-large:bg-card_dark_bg max-large:top-0 max-large:left-0 max-large:p-6 max-large:items-start max-large:justify-start max-large:translate-x-full duration-300 [.active_&]:translate-x-0">
          <div className="flex-grow flex items-center justify-center max-large:items-start max-large:justify-start">
            <Nav />
          </div>
          <div className="flex items-center justify-end gap-base">
            <Link
              href={ROUTE_FRAGEBOGEN}
              className="border border-border_base py-2 px-4 flex items-center justify-center text-sm text-white rounded-halfbase max-large:text-dark_text max-large:border-dark_green duration-300 hover:opacity-80">
              Angebot anfordern
            </Link>
            <Link
              href={ROUTE_KONTAKT}
              className="border duration-300 hover:opacity-80 border-green bg-green py-2 px-4 flex items-center justify-center text-sm text-white rounded-halfbase">
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
        <Link
          href={ROUTE_FRAGEBOGEN}
          className="border ml-auto mr-3 hidden max-large:flex border-border_base py-2 px-4 items-center justify-center text-sm text-white rounded-halfbase duration-300 hover:opacity-80">
          Angebot anfordern
        </Link>
        <button
          onClick={() => handleLoginClick()}
          className="border ml-auto mr-3 max-large:flex border-border_base py-2 px-4 items-center justify-center text-sm text-white rounded-halfbase duration-300 hover:opacity-80">
          ADMIN
        </button>
        <button
          onClick={() => handleRegisterClick()}
          className="border ml-auto mr-3 max-large:flex border-border_base py-2 px-4 items-center justify-center text-sm text-white rounded-halfbase duration-300 hover:opacity-80">
          Register
        </button>
        <HeaderButton />
      </div>
    </header>
  );
}
