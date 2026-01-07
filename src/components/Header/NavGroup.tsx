"use client";

import { right_arrow } from "@/static/icons";
import type { NavGroupType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type NavGroupProps = {
  group: NavGroupType;
};

export default function NavGroup({
  group: { title, route, groupTitle, groupLinks, rightSide },
}: NavGroupProps) {
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  const handleBurgerMenu = () => {
    const burger = document.querySelector(".burger");
    if (!burger) return;

    const menu = burger.parentNode as HTMLDivElement | null;
    if (menu) {
      burger.classList.remove("active");
      menu.classList.remove("active");
      document.documentElement.classList.remove("_lock");
    }
  };

  return (
    <div className="group relative [.scrolled_&]:py-4 py-5 max-large:py-3 max-large:w-full duration-300">
      {/* Desktop link - visible on large screens */}
      <Link
        href={route}
        onClick={() => handleBurgerMenu()}
        className="flex max-large:hidden items-center text-base max-xl:text-sm text-dark_text justify-start gap-2"
      >
        {title}
        <Image
          className="colored-to-black"
          loading="lazy"
          src={right_arrow}
          alt="arrow"
        />
      </Link>
      
      {/* Mobile dropdown toggle - visible on mobile */}
      <button
        onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
        className="hidden max-large:flex items-center text-base text-dark_text justify-center gap-2 w-full"
      >
        {title}
        <Image
          className={`colored-to-black transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-90' : ''}`}
          loading="lazy"
          src={right_arrow}
          alt="arrow"
        />
      </button>
      
      {/* Mobile dropdown content */}
      {isMobileDropdownOpen && (
        <div className="hidden max-large:block bg-white rounded-base mt-2 py-2 px-3">
          <ul className="space-y-1">
            {groupLinks.map((link) => (
              <li key={link.title}>
                <Link
                  className="flex items-center justify-start gap-3 text-dark_text/70 text-sm py-1.5 px-2 rounded-base duration-300 hover:bg-link/20 cursor-pointer"
                  href={link.link ? link?.link : route}
                  onClick={() => {
                    setIsMobileDropdownOpen(false);
                    handleBurgerMenu();
                  }}
                >
                  <Image
                    width={20}
                    height={20}
                    sizes="100vw"
                    loading="lazy"
                    className="size-5 max-h-5 max-w-5"
                    src={link.icon}
                    alt="modal_icon"
                  />
                  <span className="line-clamp-2">{link.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={route}
            onClick={() => {
              setIsMobileDropdownOpen(false);
              handleBurgerMenu();
            }}
            className="block text-center text-sm text-green mt-2 py-1"
          >
            Alle anzeigen →
          </Link>
        </div>
      )}
      
      {/* Desktop dropdown - unchanged */}
      <div className="absolute bg-white shadow-2xl w-[620px] top-[100%] max-large:grid-cols-1 mx-5 pl-16 pr-8 py-9 rounded-base grid grid-cols-2 left-1/2 -translate-x-1/2 gap-20 -translate-y-[200%] group-hover:translate-y-0 max-large:hidden">
        <div>
          <p className="mb-5 text-xl text-dark_text">{groupTitle}</p>
          <ul>
            {groupLinks.map((link) => (
              <li key={link.title} className="nav-link-wrapper">
                <Link
                  className="flex items-center justify-start gap-4 text-dark_text/50 text-[15px] py-2.5 px-3.5 rounded-base duration-300 hover:bg-link/20 cursor-pointer"
                  href={link.link ? link?.link : route}
                >
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    style={{ width: "100%", height: "auto" }}
                    className="size-7 max-h-7 max-w-7"
                    src={link.icon}
                    alt="modal_icon"
                  />
                  <span className="line-clamp-2">{link.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {rightSide}
      </div>
    </div>
  );
}
