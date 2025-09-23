import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { X } from "lucide-react";
import Image from "next/image";
import { pdf_icon } from "@/static/icons";
import type { UploadedDocument } from "@/types";
import Link from "next/link";

type FilePreview = File & { preview: string };

type FormDocumentProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  existingFiles?: UploadedDocument[];
  onRemoveExistingFile?: (id: string) => void;
  deletedFileIds?: string[];
  title?: string;
};

export default function FormDocument<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  disabled = false,
  existingFiles,
  onRemoveExistingFile,
  deletedFileIds = [],
  title = "Verwaltungsdokumente",
}: FormDocumentProps<T>) {
  return (
    <div className="w-full py-5 max-xl:py-2.5 space-y-3">
      {title && <h2 className="text-sm font-bold">{title}</h2>}
      <p className="text-[#757575] text-sm">{label}</p>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DropzoneArea
            files={field.value || []}
            onChange={field.onChange}
            disabled={disabled}
            existingFiles={existingFiles}
            deletedFileIds={deletedFileIds}
            onRemoveExistingFile={onRemoveExistingFile}
          />
        )}
      />
    </div>
  );
}

type DropzoneAreaProps = {
  files: FilePreview[];
  onChange: (files: FilePreview[]) => void;
  disabled?: boolean;
  existingFiles?: UploadedDocument[];
  onRemoveExistingFile?: (id: string) => void;
  deletedFileIds?: string[];
};

function DropzoneArea({
  files,
  onChange,
  disabled,
  existingFiles,
  onRemoveExistingFile,
  deletedFileIds,
}: DropzoneAreaProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const fileWithPreview = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      });

      onChange([fileWithPreview]);
    },
    [onChange]
  );

  const removeFile = () => {
    onChange([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled,
  });

  return (
    <div className="mb-4">
      {existingFiles && existingFiles.length > 0 && (
        <ul className="mt-4 mb-6 space-y-6 pb-4">
          {existingFiles.map((file) => {
            const isMarkedForDeletion = deletedFileIds?.includes(file.id);
            return (
              <li
                key={file.id}
                className={`flex justify-between items-center pl-12 ${isMarkedForDeletion ? "opacity-50" : ""
                  }`}>
                {isMarkedForDeletion ? (
                  <span className="text-sm flex items-center gap-12 truncate line-through text-gray-400 cursor-not-allowed">
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      loading="lazy"
                      className="block mx-auto"
                      src={pdf_icon}
                      alt="pdf_icon"
                    />
                    {file.name}
                  </span>
                ) : (
                  <Link
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-12 truncate text-[#757575]">
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      loading="lazy"
                      className="block mx-auto"
                      src={pdf_icon}
                      alt="pdf_icon"
                    />
                    {file.name}
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  {!isMarkedForDeletion ? (
                    <button
                      type="button"
                      aria-label="Datei entfernen"
                      onClick={() => onRemoveExistingFile?.(file.id)}
                      className="text-dark_green cursor-pointer hover:text-red-700">
                      <X size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRemoveExistingFile?.(file.id)}
                      className="text-xs cursor-pointer text-blue-600 hover:underline">
                      Undo
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {files.length === 1 && (
        <ul className="mt-4 mb-9 max-xl:mt-2 max-xl:mb-5">
          <li className="flex justify-between items-center pl-12 max-xl:pl-6">
            <span className="text-sm flex items-center gap-12 max-xl:gap-6 truncate text-[#757575]">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="block mx-auto"
                src={pdf_icon}
                alt="pdf_icon"
              />
              {files[0].name}
            </span>
            <button
              type="button"
              aria-label="Datei entfernen"
              onClick={() => !disabled && removeFile()}
              className="text-dark_green cursor-pointer hover:text-red-700">
              <X size={16} />
            </button>
          </li>
        </ul>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-3.5 text-center cursor-pointer transition ${isDragActive ? "border-green bg-green/20" : "border-link"
          }`}>
        <input disabled={disabled} {...getInputProps()} />
        <p className="text-link max-xl:text-sm">
          {isDragActive ? "Datei hier ablegen..." : "Rechnung hochladen"}
        </p>
      </div>
    </div>
  );
}
