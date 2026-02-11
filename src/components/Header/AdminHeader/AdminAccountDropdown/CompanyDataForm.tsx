'use client'

import { supabase } from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import ModalFooter from './ModalFooter';

// --- 2. Unternehmensdaten Form (Company Data) ---
// TO DO: Confirm if supabase connection is correct (if table selected in onSubmit is correct)
// TO DO: Create table for the company logos needed
export default function CompanyDataForm({ onClose, inputStyle, labelStyle }: { onClose: () => void, inputStyle: string, labelStyle: string }) {
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
}
