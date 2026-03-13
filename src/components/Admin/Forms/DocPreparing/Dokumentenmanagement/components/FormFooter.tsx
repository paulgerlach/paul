"use client";

import Link from "next/link";
import { Button } from "@/components/Basic/ui/Button";

interface FormFooterProps {
    backLink: string;
    step: "upload" | "review";
    isPending: boolean;
    disabled?: boolean;
}

export function FormFooter({ backLink, step, isPending, disabled }: FormFooterProps) {
    return (
        <div className="flex justify-between mt-6">
            <Link
                className="py-4 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm max-medium:px-3 max-medium:py-2 max-medium:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-white cursor-pointer font-medium hover:bg-[#e0e0e0]/50 transition-colors duration-300"
                href={backLink}
            >
                Überspringen
            </Link>

            <Button
                className="bg-ai-blue text-white"
                type="submit"
                disabled={isPending || disabled}
            >
                {step === "upload"
                    ? "Rechnungen analysieren"
                    : "Dokumente hochladen"}
            </Button>
        </div>
    );
}
