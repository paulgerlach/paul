"use client";

import Link from "next/link";
import HeaderButton from "./HeaderButton";
import Image from "next/image";
import { cellphone, login, logo } from "@/static/icons";
import { ROUTE_FRAGEBOGEN, ROUTE_HOME, ROUTE_KONTAKT } from "@/routes/routes";
import Nav from "./Nav";
import { useEffect, useState, useRef } from "react";
import { useDialogStore } from "@/store/useDIalogStore";

export default function Header() {
  const { openDialog } = useDialogStore();
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

  return (
    <header
      id="header"
      ref={headerRef}
      className={`fixed w-full mx-auto !px-[72px] max-megalarge:!px-16 max-large:!px-6 max-medium:!px-5 top-2.5 left-1/2 -translate-x-1/2 duration-300 ${scrolled ? "scrolled" : ""
        }`}>
      <div className="flex items-center w-full px-5 rounded-full bg-white/30 backdrop-blur-lg duration-300 max-large:[.scrolled_&]:py-3 max-large:py-4 ease-in-out justify-between">
        <Link
          href={ROUTE_HOME}
          className="flex items-center max-w-16 w-full h-5 justify-start gap-3">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            style={{ width: "100%", height: "auto" }}
            className="max-w-16 w-full h-5 colored-to-black"
            src={logo}
            alt="logo"
          />
        </Link>
        <div className="flex-grow flex items-center justify-end max-large:fixed max-large:flex-col max-large:w-screen max-large:h-screen max-large:bg-card_dark_bg max-large:top-0 max-large:left-0 max-large:p-6 max-large:items-start max-large:justify-start max-large:translate-x-full duration-300 [.active_&]:translate-x-0">
          <div className="flex-grow flex items-center justify-center max-large:items-start max-large:justify-start">
            <Nav />
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => openDialog("login")}
              className="p-2 flex items-center cursor-pointer gap-1.5 justify-center text-base max-xl:text-sm text-dark_text">
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
            </button>
            <Link
              href="tel:01759223454"
              className="p-2 flex items-center gap-1.5 justify-center text-base max-xl:text-sm text-dark_text">
              <Image
                width={16}
                height={16}
                loading="lazy"
                className="max-w-4 min-w-4 min-h-4 w-full max-h-4"
                style={{ width: "100%", height: "auto" }}
                src={cellphone}
                alt="cellphone"
              />
              01759223454
            </Link>
            <Link
              href={ROUTE_KONTAKT}
              className="border duration-300 hover:opacity-80 border-green bg-green py-2 px-4 flex items-center justify-center text-base max-xl:text-sm text-darl_text rounded-halfbase">
              Demo buchen
            </Link>
          </div>
        </div>
        <Link
          href={ROUTE_FRAGEBOGEN}
          className="border ml-auto mr-3 hidden max-large:flex border-border_base py-2 px-4 items-center justify-center text-base max-xl:text-sm text-white rounded-halfbase duration-300 hover:opacity-80">
          Angebot anfordern
        </Link>
        <HeaderButton />
      </div>
    </header>
  );
}
