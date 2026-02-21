"use client";

import Image from "next/image";
import {
  useFieldArray,
  Control,
  FieldValues,
  Path,
  ArrayPath,
  FieldArray,
} from "react-hook-form";
import { admin_plus } from "@/static/icons";
import FormInputField from "./FormInputField";
import FormSelectField from "./FormSelectField";
import { TrashIcon } from "@heroicons/react/24/outline";

type FormMetersProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
};

export default function FormMetersField<T extends FieldValues = FieldValues>({
  control,
}: FormMetersProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "meters" as ArrayPath<T>,
  });

  return (
    <div className="w-full border-b py-5 space-y-3 border-dark_green/10">
      <h2 className="text-sm font-bold">Funkzählerkonfiguration</h2>

      <FormInputField<T>
        control={control}
        name={"id" as Path<T>}
        label="Wohnungs Identifikationsnummer*"
        placeholder=""
        disabled
      />

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end"
        >
          <FormInputField<T>
            control={control}
            className="w-fit"
            name={`meters.${index}.meter_number` as Path<T>}
            label="Zähler Identifikationsnummer"
            placeholder="Zählernummer"
          />
          <FormSelectField<T>
            control={control}
            name={`meters.${index}.meter_type` as Path<T>}
            label="Zählerart"
            options={[
              "Kaltwasserzähler",
              "Warmwasserzähler",
              "Wärmemengenzähler",
              "Heizkostenverteiler",
              "Stromzähler",
              "Rauchwarnmelder",
              "Gateway",
            ]}
            placeholder="Zählerart auswählen"
          />
          <FormInputField<T>
            control={control}
            name={`meters.${index}.meter_note` as Path<T>}
            label="Gerätestandort"
            placeholder="Gerätestandort"
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500 cursor-pointer font-bold p-2"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          append({
            meter_number: "",
            meter_note: "",
            meter_type: "",
          } as FieldArray<T, ArrayPath<T>>)
        }
        className="flex items-center mb-7 [.available_&]:mx-3 w-fit justify-center gap-2 px-6 py-5 max-xl:py-2.5 max-xl:px-3 border border-dark_green rounded-md bg-white text-sm font-medium text-admin_dark_text"
      >
        <Image
          width={0}
          height={0}
          sizes="100vw"
          loading="lazy"
          className="max-w-4 max-h-4 max-xl:max-w-3 max-xl:max-h-3"
          src={admin_plus}
          alt="admin_plus"
        />
        Zähler hinzufügen
      </button>
    </div>
  );
}
