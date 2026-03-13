'use client';

import { supabase } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import ModalFooter from "./ModalFooter";
import { toast } from "sonner";

interface PasswordPackage {
  password:string
  passwordRepeat:string
}


// --- 4. Sicherheit (Security) ---
// TO DO: Confirm if supabase connection is correct (if table selected in onSubmit is correct)
export default function SecurityForm({ onClose, inputStyle, labelStyle }: { onClose: () => void, inputStyle: string, labelStyle: string }) {
  const { register, handleSubmit } = useForm();


  // This is done on the client, this has been advised that our security is not acceptable
  // This is a hotfix to allow the application to work
  const onSubmit = async (data: PasswordPackage) => {

  if(data.password !== data.passwordRepeat) {
    toast.error("Die Passwörter passen nicht überein");
    return;
  }

  // I understand this is against convention, this will be removed in the new codebase.
  const {data: userResponse, error} = await supabase.auth.updateUser({
    password: data.password
  })

  if (error) {
    console.error(error);
    return;
  }

  toast.success("Das Password wurde erfolgreich geändert");
  onClose();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-2">
      <div className="w-full space-y-2">
        <label className={labelStyle}>Passwort</label>
        <input {...register("password")} type="password" className={inputStyle} required={true} />
      </div>

      <div className="w-full space-y-2">
        <label className={labelStyle}>Passwort wiederholen</label>
        <input {...register("passwordRepeat")} type="password" className={inputStyle} required={true} />
      </div>

      <div className="pt-4">
        <ModalFooter onClose={onClose} />
      </div>
    </form>
  );
};
