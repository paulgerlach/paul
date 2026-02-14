"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Building2, User } from "lucide-react";
import { login } from "@/static/icons";
import { useDialogStore } from "@/store/useDIalogStore";

interface LoginDropdownProps {
  className?: string;
  isMobile?: boolean;
}

export default function LoginDropdown({ className = "", isMobile = false }: LoginDropdownProps) {
  const { openDialog } = useDialogStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVermieterClick = () => {
    setIsOpen(false);
    openDialog("login");
    
    // Close mobile menu if open
    if (isMobile) {
      const burger = document.querySelector(".burger");
      if (burger) {
        const menu = burger.parentNode as HTMLDivElement | null;
        if (menu) {
          burger.classList.remove("active");
          menu.classList.remove("active");
          document.documentElement.classList.remove("_lock");
        }
      }
    }
  };

  const handleMieterClick = () => {
    setIsOpen(false);
    openDialog("tenantLogin");
    
    // Close mobile menu if open
    if (isMobile) {
      const burger = document.querySelector(".burger");
      if (burger) {
        const menu = burger.parentNode as HTMLDivElement | null;
        if (menu) {
          burger.classList.remove("active");
          menu.classList.remove("active");
          document.documentElement.classList.remove("_lock");
        }
      }
    }
  };

  if (isMobile) {
    // Mobile version - full width buttons
    return (
      <div className="flex flex-col w-full gap-2">
        <button
          onClick={handleVermieterClick}
          className="w-full p-4 flex items-center cursor-pointer gap-2 justify-center text-lg text-dark_text bg-white border-2 border-green rounded-halfbase min-h-[48px] hover:opacity-80 transition"
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
          Vermieter Login
        </button>
        <button
          onClick={handleMieterClick}
          className="w-full p-4 flex items-center cursor-pointer gap-2 justify-center text-lg text-dark_text bg-gray-100 border border-gray-300 rounded-halfbase min-h-[48px] hover:opacity-80 transition"
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
          Mieter Login
        </button>
      </div>
    );
  }

  // Desktop version - dropdown
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 flex items-center cursor-pointer gap-1.5 justify-center text-base max-xl:text-sm text-dark_text hover:opacity-80 transition"
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
        <svg 
          className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu - Matches Heidi Design */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-base shadow-2xl py-2 z-50">
          <button
            onClick={handleVermieterClick}
            className="w-full px-4 py-3 text-left hover:bg-link/20 flex items-center gap-3 transition-colors duration-300"
          >
            <Building2 className="w-5 h-5 text-dark_text/50" />
            <div>
              <div className="text-dark_text text-sm font-medium">Vermieter</div>
              <div className="text-dark_text/50 text-xs">Immobilien verwalten</div>
            </div>
          </button>
          
          <button
            onClick={handleMieterClick}
            className="w-full px-4 py-3 text-left hover:bg-link/20 flex items-center gap-3 transition-colors duration-300"
          >
            <User className="w-5 h-5 text-dark_text/50" />
            <div>
              <div className="text-dark_text text-sm font-medium">Mieter</div>
              <div className="text-dark_text/50 text-xs">Dashboard ansehen</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
