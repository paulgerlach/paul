"use client";

import type { ContractorType } from "@/types";
import { useState } from "react";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

export function useContractorActions<T extends FieldValues>(
  methods: UseFormReturn<T>
) {
  const [markedForDelete, setMarkedForDelete] = useState<number[]>([]);

  const fieldName = "contractors" as Path<T>;

  const addContractor = () => {
    const current = methods.getValues(fieldName) ?? [];
    const newContractor: Partial<ContractorType> = {
      first_name: "",
      last_name: "",
      birth_date: new Date().toISOString(),
      email: "",
      phone: "",
      is_main: false,
    };

    const updated = [...current, newContractor] as PathValue<T, Path<T>>;
    methods.setValue(fieldName, updated);
  };

  const markForDelete = (index: number) => {
    setMarkedForDelete((prev) =>
      prev.includes(index) ? prev : [...prev, index]
    );
  };

  const undoDelete = (index: number) => {
    setMarkedForDelete((prev) => prev.filter((i) => i !== index));
  };

  const deletePermanently = (index: number) => {
    const current = methods.getValues(fieldName) ?? [];
    const updated = current.filter((_, i) => i !== index) as PathValue<
      T,
      Path<T>
    >;
    methods.setValue(fieldName, updated);

    setMarkedForDelete((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i))
    );
  };

  const isMarkedForDelete = (index: number) => markedForDelete.includes(index);

  return {
    addContractor,
    markForDelete,
    undoDelete,
    deletePermanently,
    isMarkedForDelete,
    markedForDelete,
  };
}
