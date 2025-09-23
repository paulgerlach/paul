import { useEffect } from "react";
import { snakeCase } from "lodash";
import { Path, UseFormReturn } from "react-hook-form";

export function useAutoSnakeCase<T extends Record<string, any>>(
  methods: UseFormReturn<T>,
  sourceField: Path<T>,
  targetField: Path<T>
) {
  useEffect(() => {
    const subscription = methods.watch((value, { name: changedField }) => {
      if (changedField === sourceField) {
        const snake = snakeCase(value[sourceField] || "");
        methods.setValue(targetField, snake as T[keyof T]);
      }
    });
    return () => subscription.unsubscribe?.();
  }, [methods, sourceField, targetField]);
}
