import { Control, FieldValues, Path, UseFormReturn } from "react-hook-form";
import FormInputField from "./FormInputField";
import FormDateInput from "./FormDateInput";
import { X, Undo, Trash } from "lucide-react";
import { Fragment, useState } from "react";

export type FormContractorFieldProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  index: number;
  disabled?: boolean;
  methods: UseFormReturn<T>;
  onRemove: (index: number) => void;
};

export default function FormContractorField<
  T extends FieldValues = FieldValues,
>({
  control,
  index,
  disabled,
  methods,
  onRemove,
}: FormContractorFieldProps<T>) {
  const [isMarkedForDelete, setIsMarkedForDelete] = useState(false);

  const markForDelete = () => {
    setIsMarkedForDelete(true);
  };

  const undoDelete = () => {
    setIsMarkedForDelete(false);
  };

  return (
    <Fragment>
      {isMarkedForDelete ? (
        <div className="flex items-center justify-between mb-4">
          <span className="text-red-500">
            Dieser Eintrag ist markiert zum Löschen
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-500 cursor-pointer flex items-center justify-center hover:underline">
              <Trash size={16} />
            </button>
            <button
              type="button"
              onClick={undoDelete}
              className="text-blue-500 cursor-pointer flex items-center justify-center hover:underline">
              <Undo size={16} />
            </button>
          </div>
        </div>
      ) : (
        methods.getValues("contractors" as Path<T>).length > 1 && (
          <button
            type="button"
            onClick={markForDelete}
            className="text-red-500 cursor-pointer flex items-center justify-center mr-0 ml-auto">
            <X size={16} />
          </button>
        )
      )}
      <div
        className={`grid grid-cols-3 max-medium:grid-cols-1 gap-4 max-medium:gap-3 ${isMarkedForDelete ? "opacity-50 pointer-events-none" : ""
          }`}>
        <FormInputField<T>
          control={control}
          disabled={disabled}
          name={`contractors.${index}.first_name` as Path<T>}
          label="Vorname*"
          placeholder="Vorname"
        />
        <FormInputField<T>
          control={control}
          disabled={disabled}
          name={`contractors.${index}.last_name` as Path<T>}
          label="Famillienname*"
          placeholder="Famillienname"
        />
        <FormDateInput<T>
          control={control}
          disabled={disabled}
          label="Geburtsdatum"
          name={`contractors.${index}.birth_date` as Path<T>}
        />
        <FormInputField<T>
          control={control}
          disabled={disabled}
          name={`contractors.${index}.email` as Path<T>}
          type="email"
          label="Emailadresse"
          placeholder="Emailadresse"
        />
        <FormInputField<T>
          control={control}
          disabled={disabled}
          name={`contractors.${index}.phone` as Path<T>}
          type="phone"
          label="Telefonnummer"
          placeholder="Telefonnummer"
        />
      </div>
    </Fragment>
  );
}
