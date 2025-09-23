"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Label,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

export type SelectProps = {
  options: string[];
  disabled?: boolean;
  label: string;
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function Select({
  options,
  disabled,
  label,
  selectedValue,
  onChange,
  placeholder,
}: SelectProps) {
  return (
    <Listbox value={selectedValue} onChange={onChange}>
      <Label className="text-[#757575] text-sm">{label}</Label>
      <div className="relative min-w-[195px]">
        <ListboxButton
          disabled={disabled}
          className="grid w-full cursor-default grid-cols-1 bg-white text-left text-admin_dark_text focus:outline-2 focus:outline-green max-xl:text-sm max-xl:py-2 px-3.5 py-4 border border-black/20 rounded-md max-xl:min-h-10 min-h-14">
          <span className="truncate pr-6">
            {selectedValue ? selectedValue : placeholder}
          </span>
          <ChevronDownIcon
            className="absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-500"
            aria-hidden="true"
          />
        </ListboxButton>

        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 max-small:text-sm">
          {options.map((option) => (
            <ListboxOption
              key={option}
              value={option}
              className="group relative select-none py-2 max-xl:py-1 max-xl:text-sm pl-3 pr-9 text-admin_dark_text cursor-pointer data-focus:bg-green/50 data-focus:text-white">
              <span className="block truncate font-normal group-data-selected:font-semibold">
                {option}
              </span>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-green/50 group-not-data-selected:hidden group-data-focus:text-white">
                <CheckIcon className="size-5" aria-hidden="true" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
