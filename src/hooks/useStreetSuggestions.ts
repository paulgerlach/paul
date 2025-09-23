import { useState, useMemo, useCallback } from "react";
import debounce from "lodash/debounce";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { toast } from "sonner";

export function useStreetSuggestions<T extends FieldValues>() {
  const [streetOptions, setStreetOptions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const fetchStreets = useMemo(
    () =>
      debounce(async (zip: string) => {
        if (zip.length >= 4) {
          try {
            const res = await fetch(
              `https://openplzapi.org/de/Streets?postalCode=${zip}`
            );
            const data = await res.json();
            const names = data?.map((d: any) => d.name).filter(Boolean) || [];

            if (names.length === 0) {
              toast.error(
                "Keine Straßenvorschläge gefunden. Bitte Adresse manuell eingeben oder andere Postleitzahl versuchen."
              );
              setStreetOptions([]);
              setShowSuggestions(false);
              return;
            }

            setStreetOptions(names);
            setShowSuggestions(true);
          } catch (err) {
            console.error("Error fetching streets:", err);
            toast.error("Fehler beim Laden der Straßenvorschläge.");
            setStreetOptions([]);
            setShowSuggestions(false);
          }
        }
      }, 500),
    []
  );

  const handleStreetSelect = useCallback(
    (selected: string, setValue: UseFormSetValue<T>) => {
      setValue("street" as Path<T>, selected as PathValue<T, Path<T>>);
      setShowSuggestions(false);
    },
    []
  );

  return {
    streetOptions,
    showSuggestions,
    fetchStreets,
    handleStreetSelect,
    setShowSuggestions,
  };
}
