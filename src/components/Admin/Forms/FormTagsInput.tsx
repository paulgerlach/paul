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
};

export default function FormTagsInput<T extends FieldValues = FieldValues>({
  control,
}: FormTagsInputProps<T>) {
  const [tagInput, setTagInput] = useState("");
  const { setValue } = useFormContext<T>();
  const tags: string[] = useWatch({ control, name: "tags" as Path<T> }) || [];

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === "," || e.key === "Tab") &&
      tagInput.trim() !== ""
    ) {
      e.preventDefault();

      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setValue("tags" as Path<T>, updatedTags as any);
      }

      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setValue("tags" as Path<T>, updatedTags as any);
  };

  return (
    <FormField
      control={control}
      name={"tags" as Path<T>}
      render={() => (
        <FormItem className="space-y-4 pb-4 border-b border-dark_green/20">
          <FormControl>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Tag hinzufügen (Eigentümer- Zuordnung)"
              className="w-8/12 block px-3 py-2 text-sm border border-dark_green bg-[#757575]/20 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:border-green focus:ring-green"
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
                  onClick={() => handleRemoveTag(index)}
                  className="text-green-600 cursor-pointer hover:text-red-500 font-bold text-sm">
                  &times;
                </button>
              </span>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
