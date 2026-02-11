'use client';

import { supabase } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import ModalFooter from "./ModalFooter";

// --- 4. Sicherheit (Security) ---
// TO DO: Confirm if supabase connection is correct (if table selected in onSubmit is correct)
export default function SecurityForm({ onClose, inputStyle, labelStyle }: { onClose: () => void, inputStyle: string, labelStyle: string }) {
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
