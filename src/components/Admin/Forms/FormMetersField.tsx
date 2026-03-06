"use client";

import Image from "next/image";
import {
  useFieldArray,
  useWatch,
  Control,
  FieldValues,
  Path,
  ArrayPath,
  FieldArray,
} from "react-hook-form";
import { admin_plus } from "@/static/icons";
import FormInputField from "./FormInputField";
import FormSelectField from "./FormSelectField";
import FormDateInput from "./FormDateInput";
import { TrashIcon } from "@heroicons/react/24/outline";

const HEIZKOSTENVERTEILER_RADIATOR_TYPE_OPTIONS = [
  "Typ 11",
  "Typ 21",
  "Typ 22",
  "Typ 33",
  "Guss",
  "Weiterer",
];

const HEIZKOSTENVERTEILER_INSTALLATION_FACTOR_OPTIONS = [
  "Standardinstallation",
  "stärker installierte bzw. gut gedämmte Ausführung",
];

const FERNFUEHLER_OPTIONS = ["Ja", "Nein"];

const REPEATER_COUNT_OPTIONS = [
  "1x Repeater",
  "2x Repeater",
  "3x Repeater",
];

const TYPE_SECTION_CLASS =
  "grid grid-cols-[1fr_1fr_1fr_auto] max-medium:grid-cols-1 gap-4 max-medium:gap-3 [&>*]:min-w-0";

const TYPE_SECTION_SPACER = (
  <div
    className="col-start-4 row-start-1 row-end-[-1] max-medium:hidden p-2"
    aria-hidden
  >
    <div className="h-5 w-5" />
  </div>
);

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

  const watchedMeters = useWatch({ control, name: "meters" as Path<T> });

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

      {fields.map((field, index) => {
        const meter = Array.isArray(watchedMeters) ? watchedMeters[index] : undefined;
        const meterType = meter?.meter_type;
        const isHeizkostenverteiler = meterType === "Heizkostenverteiler";
        const isGateway = meterType === "Gateway";
        const isRepeater = meterType === "Repeater";
        const isWaterMeter = [
          "Warmwasserzähler",
          "Kaltwasserzähler",
          "Wärmemengenzähler",
          "Kältezähler",
          "Elektrozähler",
        ].includes(meterType ?? "");
        const isRauchwarnmelder = meterType === "Rauchwarnmelder";

        return (
          <div key={field.id} className="space-y-4">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end max-medium:grid-cols-1">
              <FormInputField<T>
                control={control}
                className="min-w-0"
                name={`meters.${index}.meter_number` as Path<T>}
                label="Zähler Identifikationsnummer"
                placeholder="Zählernummer"
              />
              <FormSelectField<T>
                control={control}
                className="min-w-0"
                name={`meters.${index}.meter_type` as Path<T>}
                label="Zählerart"
                options={[
                  "Kaltwasserzähler",
                  "Warmwasserzähler",
                  "Wärmemengenzähler",
                  "Heizkostenverteiler",
                  "Elektrozähler",
                  "Rauchwarnmelder",
                  "Kältezähler",
                  "Gateway",
                  "Repeater",
                ]}
                placeholder="Zählerart auswählen"
              />
              <FormInputField<T>
                control={control}
                className="min-w-0"
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

            {isHeizkostenverteiler && (
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 max-medium:grid-cols-1 max-medium:gap-3">
                <div className="col-span-3 grid grid-cols-3 gap-4 max-medium:col-span-1 max-medium:grid-cols-1 max-medium:gap-3 [&>*]:min-w-0">
                  <FormInputField<T>
                    control={control}
                    className="min-w-0"
                    name={`meters.${index}.old_reading` as Path<T>}
                    label="Alter Zählerstand"
                    placeholder="Zählerstand"
                    replaceDotWithComma
                  />
                  <FormDateInput<T>
                    control={control}
                    className="min-w-0"
                    name={`meters.${index}.installation_date` as Path<T>}
                    label="Datum des Einbaus"
                    placeholder="dd.mm.yyyy"
                    valueAsString
                  />
                  <FormSelectField<T>
                    control={control}
                    className="min-w-0"
                    name={`meters.${index}.fernfuehler` as Path<T>}
                    label="Fernfühler"
                    placeholder="Ja/Nein"
                    options={FERNFUEHLER_OPTIONS}
                  />
                  <FormSelectField<T>
                    control={control}
                    className="min-w-0"
                    name={`meters.${index}.radiator_type` as Path<T>}
                    label="Heizkörper Typ"
                    placeholder="Heizkörper Typ auswählen"
                    options={HEIZKOSTENVERTEILER_RADIATOR_TYPE_OPTIONS}
                  />
                  <FormInputField<T>
                    control={control}
                    className="min-w-0"
                    name={`meters.${index}.radiator_length` as Path<T>}
                    label="Heizkörper Länge"
                    placeholder="cm"
                    replaceDotWithComma
                  />
                  <FormInputField<T>
                    control={control}
                    className="min-w-0"
                    name={`meters.${index}.radiator_width` as Path<T>}
                    label="Heizkörper Breite"
                    placeholder="cm"
                    replaceDotWithComma
                  />
                  <FormInputField<T>
                    control={control}
                    className="min-w-0"
                    name={`meters.${index}.radiator_depth` as Path<T>}
                    label="Heizkörper Tiefe"
                    placeholder="cm"
                    replaceDotWithComma
                  />
                  <FormSelectField<T>
                    control={control}
                    className="min-w-0"
                    name={`meters.${index}.installation_factor` as Path<T>}
                    label="Installationsfaktor"
                    placeholder="Installationsfaktor auswählen"
                    options={HEIZKOSTENVERTEILER_INSTALLATION_FACTOR_OPTIONS}
                  />
                </div>
                <div
                  className="col-start-4 row-start-1 row-end-[-1] max-medium:hidden p-2"
                  aria-hidden>
                  <div className="h-5 w-5" />
                </div>
              </div>
            )}

            {isGateway && (
              <div className={TYPE_SECTION_CLASS}>
                <FormInputField<T>
                  control={control}
                  name={`meters.${index}.installation_location` as Path<T>}
                  label="Installations Standort"
                  placeholder="Standort"
                />
                <FormDateInput<T>
                  control={control}
                  name={`meters.${index}.installation_date` as Path<T>}
                  label="Einbaudatum"
                  placeholder="dd.mm.yyyy"
                  valueAsString
                />
                <FormInputField<T>
                  control={control}
                  name={`meters.${index}.gateway_eui` as Path<T>}
                  label="Gateway EUI*"
                  placeholder="EUI"
                />
                <FormSelectField<T>
                  control={control}
                  name={`meters.${index}.repeater_count` as Path<T>}
                  label="Repeater installiert"
                  placeholder="Auswählen"
                  options={REPEATER_COUNT_OPTIONS}
                />
                <FormInputField<T>
                  control={control}
                  name={`meters.${index}.notes` as Path<T>}
                  label="Notizen"
                  placeholder="Notizen"
                />
                {TYPE_SECTION_SPACER}
              </div>
            )}

            {isRepeater && (
              <div className={TYPE_SECTION_CLASS}>
                <FormInputField<T>
                  control={control}
                  name={`meters.${index}.installation_location` as Path<T>}
                  label="Installations Standort"
                  placeholder="Standort"
                />
                <FormDateInput<T>
                  control={control}
                  name={`meters.${index}.installation_date` as Path<T>}
                  label="Einbaudatum"
                  placeholder="dd.mm.yyyy"
                  valueAsString
                />
                <FormInputField<T>
                  control={control}
                  name={`meters.${index}.notes` as Path<T>}
                  label="Notizen"
                  placeholder="Notizen"
                />
                {TYPE_SECTION_SPACER}
              </div>
            )}

            {isWaterMeter && (
              <div className={TYPE_SECTION_CLASS}>
                <FormInputField<T>
                  control={control}
                  name={`meters.${index}.old_reading` as Path<T>}
                  label="Alter Zählerstand"
                  placeholder="Zählerstand"
                  replaceDotWithComma
                />
                <FormInputField<T>
                  control={control}
                  name={`meters.${index}.manufacturer_old_device` as Path<T>}
                  label="Hersteller Altgerät"
                  placeholder="Hersteller"
                />
                <FormDateInput<T>
                  control={control}
                  name={`meters.${index}.calibration_date` as Path<T>}
                  label="Eichfrist"
                  placeholder="dd.mm.yyyy"
                  valueAsString
                />
                <FormInputField<T>
                  control={control}
                  name={`meters.${index}.notes` as Path<T>}
                  label="Notizen"
                  placeholder="Notizen"
                />
                {TYPE_SECTION_SPACER}
              </div>
            )}

            {isRauchwarnmelder && (
              <div className={TYPE_SECTION_CLASS}>
                <FormDateInput<T>
                  control={control}
                  name={`meters.${index}.calibration_date` as Path<T>}
                  label="Eichfrist"
                  placeholder="dd.mm.yyyy"
                  valueAsString
                />
                <FormInputField<T>
                  control={control}
                  name={`meters.${index}.notes` as Path<T>}
                  label="Notizen"
                  placeholder="Notizen"
                />
                {TYPE_SECTION_SPACER}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() =>
          append({
            meter_number: "",
            meter_note: "",
            meter_type: "",
            old_reading: null,
            installation_date: null,
            radiator_type: null,
            radiator_length: null,
            radiator_width: null,
            radiator_depth: null,
            installation_factor: null,
            fernfuehler: null,
            installation_location: null,
            gateway_eui: null,
            repeater_count: null,
            notes: null,
            manufacturer_old_device: null,
            calibration_date: null,
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
