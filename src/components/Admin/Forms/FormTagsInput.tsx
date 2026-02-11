import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/Basic/ui/Form";
import { useState } from "react";
import {
  Control,
  FieldValues,
  Path,
  useFormContext,
  useWatch,
} from "react-hook-form";

export type FormTagsInputProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  disabled?: boolean;
  name?: Path<T>;
};

export default function FormTagsInput<T extends FieldValues = FieldValues>({
  control,
  disabled,
  name = "tags" as Path<T>,
}: FormTagsInputProps<T>) {
  const [tagInput, setTagInput] = useState("");
  const { setValue } = useFormContext<T>();
  const tags: string[] = useWatch({ control, name }) || [];

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === "," || e.key === "Tab") &&
      tagInput.trim() !== ""
    ) {
      e.preventDefault();

      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setValue(name, updatedTags as any);
      }

      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setValue(name, updatedTags as any);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="space-y-4 pb-2.5 border-b border-dark_green/20">
          <FormControl>
            <input
              type="text"
              disabled={disabled}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Tag hinzufügen (Eigentümer- Zuordnung)"
              className="w-8/12 max-medium:w-full block px-[30px] h-14 max-xl:px-4 max-medium:px-3 text-sm border border-dark_green bg-[#757575]/20 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-green focus:ring-green"
            />
          </FormControl>
          <div className="flex items-center flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {tag}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleRemoveTag(index)}
                  className={`text-green-600 ${disabled ? "cursor-not-allowed" : "cursor-pointer"} hover:text-red-500 font-bold text-sm`}>
                  &times;
                </button>
              </span>
            ))}
          </div>
          <FormMessage className="text-red-500 text-sm absolute -bottom-5 left-0" />
        </FormItem>
      )}
    />
  );
}
