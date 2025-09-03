import { Metadata } from "next";
import ResetPasswordForm from "@/components/Basic/Dialog/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Passwort zurücksetzen - Heidi Systems",
  description: "Setzen Sie Ihr neues Passwort für Ihr Heidi Systems Konto zurück.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white py-8 px-6 rounded-lg shadow-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
