"use client";

import AdminApartmentsDropdownContent from "@/components/Basic/Dropdown/AdminApartmentsDropdownContent";
import { chevron_admin, main_portfolio } from "@/static/icons";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function AdminApartmentsDropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${isOpen ? "open" : ""}`}>
      <button
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-controls="admin-apartments-dropdown"
        className="flex w-full items-center gap-4 justify-between bg-transparent border-none cursor-pointer px-6 py-3">
        <div className="flex items-center justify-start whitespace-nowrap gap-2">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            className="max-w-4 max-h-5"
            loading="lazy"
            style={{ width: "100%", height: "auto" }}
            alt="main_portfolio"
            src={main_portfolio}
          />
          Mein Portfolio
        </div>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          className="max-w-4 max-h-5 transition-all duration-300 [.open_&]:rotate-180"
          loading="lazy"
          style={{ width: "100%", height: "auto" }}
          alt="chevron_admin"
          src={chevron_admin}
        />
      </button>
      {isOpen && (
        <div id="admin-apartments-dropdown">
          <AdminApartmentsDropdownContent />
        </div>
      )}
    </div>
  );
}
