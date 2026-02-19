'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useForm } from 'react-hook-form';
import ModalFooter from './ModalFooter';
import { useAuthUser } from '@/apiClient';

// --- 1. Mein Profil Form ---
// Confirm if supabase connection is correct - Updates user table of currentUser
export default function ProfileEditForm({ onClose, inputStyle, labelStyle }
  : { onClose: () => void, inputStyle: string, labelStyle: string }) {
  
  const { data: currentUser } = useAuthUser();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { isValid } } = useForm({
    mode: "onChange", // Necessary for isValid to update in real-time
    defaultValues: {
      firstName: currentUser?.first_name || '',
      lastName: currentUser?.last_name || '',
      permission: currentUser?.permission || 'user',
      email: currentUser?.email || '',
    }
  });

  const onSubmit = async (data: any) => {
    if (!currentUser?.id) return;
    setLoading(true);

    // updates if ID exists
    const { error } = await supabase
      .from("users") 
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        permission: data.permission,
        email: data.email,    
        agency_id: currentUser.agency_id,
        has_seen_tour: currentUser.has_seen_tour,
      })
      .eq("id", currentUser.id);

    setLoading(false);

    if (error) {
      console.error("Save Error:", error.message);
      return;
    }

    onClose();
  };

  const bigInputStyle = `${inputStyle} h-12 py-3 px-4 text-base`;

  return (
    <div className="w-full max-w-[670px] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
      <div className="flex gap-4 w-full">
        <div className="flex-1 space-y-1.5">
          <label className={labelStyle}>Vorname *</label>
          <input {...register("firstName", { required: true })} type="text" className={bigInputStyle} />
        </div>
        <div className="flex-1 space-y-1.5">
          <label className={labelStyle}>Nachname *</label>
          <input {...register("lastName", { required: true })} type="text" className={bigInputStyle} />
        </div>
      </div>

      <div className="w-full space-y-1.5">
        <label className={labelStyle}>Rolle im Unternehmen</label>
        <div className="relative">
          <select 
            {...register("permission")} 
            className={`${bigInputStyle} appearance-none cursor-pointer`}
          >
            <option value="super_admin">super_admin</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1L5 5L9 1" />
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>E-Mail *</label>
          <input {...register("email", { required: true })} type="text" className={bigInputStyle} />
      </div>
      <ModalFooter 
        onClose={onClose} 
        loading={loading} 
        onSave={handleSubmit(onSubmit)} 
        isValid={isValid} 
      />
    </form>
    </div>
  );
}