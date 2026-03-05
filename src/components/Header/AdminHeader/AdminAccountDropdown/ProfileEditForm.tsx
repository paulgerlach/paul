'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useForm } from 'react-hook-form';
import ModalFooter from './ModalFooter';
import { useAuthUser } from '@/apiClient';

export default function ProfileEditForm({ onClose, isOpen, inputStyle, bigInputStyle, labelStyle }
  : { onClose: () => void, isOpen: boolean, inputStyle: string, bigInputStyle: string, labelStyle: string }) {

  const { data: currentUser } = useAuthUser();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { isValid } } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      permission: 'user',
      notes: '',
    }
  });

  useEffect(() => {
    if (isOpen && currentUser) {
      const u = currentUser as { phone?: string; notes?: string };
      reset({
        firstName: currentUser.first_name || '',
        lastName: currentUser.last_name || '',
        phone: u.phone || '',
        permission: currentUser.permission || 'user',
        notes: u.notes || '',
      });
    }
  }, [isOpen, currentUser, reset]);

  const onSubmit = async (data: { firstName: string; lastName: string; phone?: string; permission: string; notes?: string }) => {
    if (!currentUser?.id) return;
    setLoading(true);

    const { error: userError } = await supabase
      .from("users")
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        permission: data.permission,
        phone: data.phone || null,
        notes: data.notes || null,
      })
      .eq("id", currentUser.id);

    setLoading(false);
    if (!userError) onClose();
  };

  return (
    <div className="w-full max-w-[800px] mx-auto">
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
          <label className={labelStyle}>Telefonnummer</label>
          <input {...register("phone")} type="text" className={bigInputStyle} />
        </div>

        <div className="w-full space-y-1.5">
          <label className={labelStyle}>Rolle im Unternehmen</label>
          <div className="relative">
            <select
              {...register("permission")}
              className={`${bigInputStyle} appearance-none cursor-pointer`}
            >
              {currentUser?.permission === "super_admin" ? (
                <option value="super_admin">super_admin</option>
              ) : currentUser?.permission === "admin" ? (
                <option value="admin">admin</option>
              ) : (
                <option value="user">user</option>
              )}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1L5 5L9 1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full space-y-1.5">
          <label className={labelStyle}>Anmerkungen</label>
          <textarea {...register("notes")} rows={3} className={`${bigInputStyle} min-h-[80px] resize-y`} />
        </div>

        <ModalFooter
          onClose={onClose}
          loading={loading}
          isValid={isValid}
        />
      </form>
    </div>
  );
}