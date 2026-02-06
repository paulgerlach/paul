"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Basic/ui/Button";
import { uploadObjektImage, adminUploadObjektImage } from "@/apiClient";
import { FormItem, FormLabel } from "@/components/Basic/ui/Form";

export type FormImageUploadProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  objektId: string;
  /** Use admin API route to bypass RLS (for super admin uploads) */
  useAdminUpload?: boolean;
};

export default function FormImageUpload<T extends FieldValues = FieldValues>({
  control,
  name,
  objektId,
  useAdminUpload = false,
}: FormImageUploadProps<T>) {
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Choose the appropriate upload function based on context
  const uploadFn = useAdminUpload ? adminUploadObjektImage : uploadObjektImage;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full space-y-5 py-5 border-dark_green/10">
          <FormLabel
            htmlFor={name}
            className="block cursor-pointer bg-green/70 rounded-md w-fit py-2 px-3 text-sm font-medium"
          >
            Objektbild hochladen
          </FormLabel>
          {field.value && (
            <div className="relative w-40 h-40 rounded overflow-hidden">
              <Image
                src={field.value}
                alt="Objektbild"
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            id={name}
            name={name}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              setError(null);
              try {
                const url = await uploadFn(file, objektId);
                field.onChange(url);
              } catch (e: any) {
                console.error(e);
                setError(e.message);
              } finally {
                setUploading(false);
              }
            }}
            className="sr-only"
          />
          {isUploading && <p className="text-xs text-gray-500">Hochladen...</p>}
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button
            type="button"
            variant="ghost"
            className="bg-red-500 w-fit !opacity-100 py-2 px-3"
            onClick={() => field.onChange(null)}
            disabled={!field.value}
          >
            Bild entfernen
          </Button>
        </FormItem>
      )}
    />
  );
}
