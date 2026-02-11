"use client";

import MenuModal from "@/components/Basic/ui/MenuModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Basic/ui/Popover";
import { chevron_admin, main_account } from "@/static/icons";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

// --- Shared Styles & Components ---
const inputStyle = "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors";
const labelStyle = "text-xs font-medium text-gray-500";

const ModalFooter = ({ onClose, loading }: { onClose?: () => void, loading?: boolean }) => (
<div className="flex justify-between items-center pt-6 mt-2">
    <button
      type="button"
      onClick={onClose}
      className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
    >
      Abbrechen
    </button>

    
    <button
      type="submit"
      disabled={loading}
      className="px-6 py-2.5 text-sm font-medium text-white bg-[#7AD085] rounded-md hover:bg-[#6bc176] shadow-sm transition-colors disabled:opacity-50"
    >
      {loading ? "Lädt..." : "Speichern"}
    </button>
  </div>
);


// --- 1. Mein Profil Form ---
// TO DO: Confirm if supabase connection is correct (if table selected in onSubmit is correct)
const ProfileEditForm = ({ onClose }: { onClose: () => void }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
  const { error } = await supabase
    .from("contractors")
    .update(data);
    console.log("Profile Data:", data);

  if (error) {
    console.error(error);
    return;
  }

  onClose();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
      <div className="flex gap-4 w-full">
        <div className="flex-1 space-y-1.5">
          <label className={labelStyle}>Vorname *</label>
          <input {...register("firstName", { required: true })} type="text" className={inputStyle} />
        </div>
        <div className="flex-1 space-y-1.5">
          <label className={labelStyle}>Nachname *</label>
          <input {...register("lastName", { required: true })} type="text" className={inputStyle} />
        </div>
      </div>
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>Telefonnummer</label>
        <input {...register("phone")} type="tel" className={inputStyle} />
      </div>
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>Rolle im Unternehmen</label>
        <div className="relative">
          <select {...register("role")} className={`${inputStyle} appearance-none cursor-pointer`} defaultValue="">
            <option value="" disabled hidden></option>
            <option value="admin">admin</option>
            <option value="manager">user</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1" /></svg>
          </div>
        </div>
      </div>
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>Anmerkungen</label>
        <textarea {...register("notes")} rows={1} className={`${inputStyle} resize-none`} />
      </div>
      <ModalFooter onClose={onClose} />
    </form>
  );
};

// --- 2. Unternehmensdaten Form (Company Data) ---
// TO DO: Confirm if supabase connection is correct (if table selected in onSubmit is correct)
// TO DO: Create table for the company logos needed
const CompanyDataForm = ({ onClose }: { onClose: () => void }) => {
  const { register, handleSubmit, watch } = useForm();
  const [preview, setPreview] = useState<string | null>(null);

  const logoFile = watch("logo");

  useEffect(() => {
    if (logoFile?.[0]) {
      const file = logoFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [logoFile]);

   const onSubmit = async (data: any) => {
    let logoUrl: string | null = null;

    // Upload logo if present
    if (data.logo?.[0]) {
      const file = data.logo[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Logo upload failed:", uploadError);
        return;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from("logos")
        .getPublicUrl(fileName);

      logoUrl = publicData.publicUrl;
    }

    // Save form + logo URL
    const { error } = await supabase
      .from("objekte")
      .update({
        company_name: data.companyName,
        street: data.street,
        zip: data.zip,
        city: data.city,
        vat_id: data.vatId,
        logo_url: logoUrl,
      });

    if (error) {
      console.error("DB update failed:", error);
      return;
    }

    onClose();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-4">
      {/* Top Row: Company Name & Logo */}
      <div className="flex gap-10 items-start">
        <div className="flex-grow space-y-1.5">
          <label className={labelStyle}>Firmenname *</label>
          <input {...register("companyName")} type="text" className={inputStyle} />
        </div>
        
        <div className="flex-shrink-0">
          <label className={labelStyle}>Firmenlogo</label>
          <label className="w-[160px] h-[45px] border-2 border-dashed border-blue-200 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-blue-50 transition-colors">
              {preview ? (
      <img
        src={preview}
        alt="Logo preview"
        className="object-contain w-full h-full"
      />
    ) : (
      <span className="text-[10px] text-blue-400 text-center px-4">
        Logo hinzufügen<br />(320 × 100 px)
      </span>
    )}

    <input
      type="file"
      accept="image/*"
      className="hidden"
      {...register("logo")}
    />
          </label>
        </div>
      </div>

      {/* Rechnungsadresse Header */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-900 m-0">Rechnungsadresse</h4>
        
        <div className="w-full space-y-1.5">
          <label className={labelStyle}>Straßenname</label>
          <input {...register("street")} type="text" className={inputStyle} />
        </div>

        <div className="flex gap-8 w-full">
          <div className="flex-1 space-y-1.5">
            <label className={labelStyle}>Postleitzahl</label>
            <input {...register("zip")} type="text" className={inputStyle} />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className={labelStyle}>Stadt</label>
            <input {...register("city")} type="text" className={inputStyle} />
          </div>
        </div>
      </div>

      <div className="w-full space-y-1.5">
        <label className={labelStyle}>Umsatzsteuer-ID</label>
        <input {...register("vatId")} type="text" className={inputStyle} />
      </div>

      <ModalFooter onClose={onClose} />
    </form>
  );
};

// --- Component for a single row (Nutzer + Rolle) ---
const TeamMemberRow = () => (
  <div className="flex gap-4 w-full">
    <div className="flex-1 space-y-1">
      <label className={labelStyle}>Nutzer</label>
      <button className={inputStyle}>
        <span className="text-transparent">Placeholder</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
    <div className="flex-1 space-y-1">
      <label className={labelStyle}>Rolle</label>
      <button className={inputStyle}>
        <span className="text-transparent">Placeholder</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </div>
);
// --- 3. Team & Rolle Form ---
// TODO(form): UI-only form. Submission + validation pending.
const TeamRolesForm = ({ onClose }: { onClose?: () => void }) => {
  const selectTriggerStyle = `${inputStyle} flex items-center justify-between text-gray-400 cursor-pointer hover:bg-gray-50`;

  const Row = () => (
    <div className="flex gap-4 w-full">
      <div className="flex-1">
        <label className={labelStyle}>Nutzer</label>
        <div className={selectTriggerStyle}>
          <span></span> {/* Empty state as shown in image */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
      <div className="flex-1">
        <label className={labelStyle}>Rolle</label>
        <div className={selectTriggerStyle}>
          <span></span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5 mt-2">
      <Row />
      <Row />
      <Row />
      
      <div className="w-full">
        <label className={labelStyle}>Weitere Nutzer</label>
        <button className="w-full py-3 border-2 border-dashed border-[#D1D5DB] rounded-lg flex items-center justify-start px-4 gap-2 text-[#9CA3AF] hover:bg-gray-50 transition-colors">
          <span className="text-xl font-light">+</span>
          <span className="text-sm">Weiteren Nutzer hinzufügen</span>
        </button>
      </div>
      <ModalFooter onClose={onClose} />
    </div>
  );
};

// --- 4. Sicherheit (Security) ---
// TO DO: Confirm if supabase connection is correct (if table selected in onSubmit is correct)
const SecurityForm = ({ onClose }: { onClose: () => void }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
  const { error } = await supabase
    .from("users")
    .update(data);
    console.log("Security Data:", data);

  if (error) {
    console.error(error);
    return;
  }

  onClose();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-2">
      <div className="w-full">
        <label className={labelStyle}>Email Adresse *</label>
        <input {...register("email")} type="email" className={inputStyle} />
      </div>
      
      <div className="w-full space-y-2">
        <label className={labelStyle}>Passwort</label>
        <input {...register("password")} type="password" className={inputStyle} />
        <button 
          type="button" 
          className="text-xs text-[#6366F1] hover:underline block pt-1"
        >
          Passwort reset
        </button>
      </div>

      <div className="pt-4">
        <ModalFooter onClose={onClose} />
      </div>
    </form>
  );
};

// --- 5. Integrationen ---
// TODO(form): Correct UI needed! + Submission + validation pending.
const IntegrationsForm = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-col gap-5 mt-2">
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>API Schlüssel</label>
        <div className="flex gap-2">
            <input type="text" value="sk_live_51J..." readOnly className={`${inputStyle} bg-gray-50 text-gray-500`} />
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50">Kopieren</button>
        </div>
      </div>
      <div className="w-full space-y-3">
        <label className={labelStyle}>Verbundene Dienste</label>
        
        {/* Toggle Simulation */}
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center text-blue-600 text-xs font-bold">DATEV</div>
                <span className="text-sm font-medium text-gray-900">DATEV Export</span>
            </div>
            <div className="w-10 h-5 bg-[#7AD085] rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            </div>
        </div>

        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-50 rounded flex items-center justify-center text-orange-600 text-xs font-bold">AWS</div>
                <span className="text-sm font-medium text-gray-900">Cloud Backup</span>
            </div>
            <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            </div>
        </div>
      </div>
      <ModalFooter onClose={onClose} />
    </div>
  );
};

// --- 6. Support ---
// TODO(form): TODO(form): Correct UI needed! + Submission + validation pending.
const SupportForm = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-col gap-5 mt-2">
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>Betreff</label>
        <select className={`${inputStyle} appearance-none cursor-pointer`} defaultValue="">
            <option value="" disabled>Wählen Sie ein Thema</option>
            <option value="technical">Technisches Problem</option>
            <option value="billing">Abrechnung</option>
            <option value="feature">Feature Wunsch</option>
          </select>
      </div>
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>Nachricht</label>
        <textarea rows={5} className={`${inputStyle} resize-none`} placeholder="Wie können wir Ihnen helfen?" />
      </div>
      <div className="flex justify-end pt-4">
        <button 
          className="w-full px-6 py-2.5 text-sm font-medium text-white bg-[#7AD085] rounded-md hover:bg-[#6bc176] shadow-sm transition-colors"
        >
          Nachricht senden
        </button>
      </div>
    </div>
  );
};


// --- Main Dropdown Component ---

export default function AdminAccountDropdown() {
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const menuItems: {
  title: string;
  render: (onClose: () => void) => ReactNode;
}[] = [
  {
    title: "Mein Profil",
    render: (onClose) => <ProfileEditForm onClose={onClose} />,
  },
  {
    title: "Unternehmensdaten",
    render: (onClose) => <CompanyDataForm onClose={onClose} />,
  },
  {
    title: "Team & Rollen",
    render: (onClose) => <TeamRolesForm onClose={onClose} />,
  },
  {
    title: "Sicherheit",
    render: (onClose) => <SecurityForm onClose={onClose} />,
  },
  {
    title: "Integrationen",
    render: (onClose) => <IntegrationsForm onClose={onClose} />,
  },
  {
    title: "Support",
    render: (onClose) => <SupportForm onClose={onClose} />,
  },
];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-3 justify-between bg-transparent border-none cursor-pointer px-2 py-3 h-full outline-none">
          <div className="flex items-center justify-start text-lg max-xl:text-sm whitespace-nowrap gap-3">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="max-w-4 max-h-4 max-xl:max-w-4 max-xl:max-h-4 w-4 h-4"
              loading="lazy"
              alt="main_account"
              src={main_account}
            />
            <span className="text-sm">Mein Konto</span>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              className="max-w-2 max-h-5 transition-all duration-300 [.open_&]:rotate-180"
              loading="lazy"
              alt="chevron_admin"
              src={chevron_admin}
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0 bg-white rounded-lg shadow-lg border border-gray-100 mt-2" align="end">
        <div className="py-2 px-4 space-y-1">
          {/* First Group */}
          {menuItems.slice(0, 4).map((item) => (
            <MenuModal
              key={item.title}
              title={item.title}
              trigger={
                <button className="block w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded outline-none transition-colors">
                  {item.title}
                </button>
              }
            >
              {(onClose) => item.render(onClose)}
            </MenuModal>
          ))}

          <div className="border-t border-gray-100 my-2" />

          {/* Second Group */}
          {menuItems.slice(4).map((item) => (
            <MenuModal
              key={item.title}
              title={item.title}
              trigger={
                <button className="block w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded outline-none transition-colors">
                  {item.title}
                </button>
              }
            >
               {(onClose) => item.render(onClose)}
            </MenuModal>
          ))}

          <div className="border-t border-gray-100 my-2" />

          <button
            onClick={signOut}
            className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-2 py-1.5 rounded outline-none transition-colors"
          >
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}