'use client';

import { supabase } from '@/utils/supabase/client';
import { useForm } from 'react-hook-form';
import ModalFooter from './ModalFooter';

// --- 1. Mein Profil Form ---
// TO DO: Confirm if supabase connection is correct (if table selected in onSubmit is correct)
export default function ProfileEditForm({ onClose, inputStyle, labelStyle }
  : { onClose: () => void, inputStyle: string, labelStyle: string }) {
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
}
