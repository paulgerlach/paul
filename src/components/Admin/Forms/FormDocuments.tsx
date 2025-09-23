import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { X } from "lucide-react";
import Image from "next/image";
import { pdf_icon } from "@/static/icons";
import type { UploadedDocument } from "@/types";
import Link from "next/link";

type FilePreview = File & { preview: string };

type FormDocumentsProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
  existingFiles?: UploadedDocument[];
  onRemoveExistingFile?: (id: string) => void;
  deletedFileIds?: string[];
};

export default function FormDocuments<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  disabled = false,
  existingFiles,
  onRemoveExistingFile,
  deletedFileIds = [],
}: FormDocumentsProps<T>) {
  return (
    <div className="w-full py-5 space-y-3">
      <h2 className="text-sm font-bold">Verwaltungsdokumente</h2>
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
      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      onChange([...files, ...filesWithPreview]);
    },
    [files, onChange]
  );

  const removeFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    onChange(updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
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
      {files.length > 0 && (
        <ul className="mt-4 mb-9 max-xl:mt-2 max-xl:mb-5">
          {files.map((file, idx) => (
            <li key={idx} className="flex justify-between items-center pl-12 max-xl:pl-6">
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
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => !disabled && removeFile(idx)}
                className="text-dark_green cursor-pointer hover:text-red-700">
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-3.5 text-center cursor-pointer transition ${isDragActive ? "border-green bg-green/20" : "border-link"
          }`}>
        <input disabled={disabled} {...getInputProps()} />
        {isDragActive ? (
          <p className="text-link">Dateien hier ablegen...</p>
        ) : (
          <p className="text-link">Unterlagen hinzufügen</p>
        )}
      </div>
    </div>
  );
}
