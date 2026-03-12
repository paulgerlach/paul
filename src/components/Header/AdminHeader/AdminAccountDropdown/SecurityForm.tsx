'use client';

import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import ModalFooter from "./ModalFooter";
import { useAuthUser } from "@/apiClient";

// --- 4. Sicherheit (Security) ---
export default function SecurityForm({ onClose, isOpen, inputStyle, bigInputStyle, labelStyle }: { onClose: () => void, isOpen: boolean, inputStyle: string, bigInputStyle: string, labelStyle: string }) {
  const { data: currentUser } = useAuthUser();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (isOpen && currentUser?.email) {
      reset({ email: currentUser.email });
    }
  }, [isOpen, currentUser?.email, reset]);

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
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>Email Adresse *</label>
        <input {...register("email")} type="email" className={bigInputStyle} />
      </div>
      
      <div className="w-full space-y-1.5">
        <label className={labelStyle}>Passwort</label>
        <input {...register("password")} type="password" className={bigInputStyle} />
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
