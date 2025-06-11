import { create } from "zustand";
import { format } from "date-fns";
import type { CostType } from "@/types";

type DocumentItem = {
  name: string;
  url: string;
};

type KeyedDocumentGroup = {
  key: CostType;
  documents: DocumentItem[];
};

export type HeizkostenabrechnungStoreType = {
  start_date: Date | null;
  end_date: Date | null;
  documentGroups: KeyedDocumentGroup[];
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  getFormattedDates: () => { start_date: string; end_date: string };
  addDocumentGroup: (group: KeyedDocumentGroup) => void;
  updateDocumentGroup: (key: CostType, documents: DocumentItem[]) => void;
  removeDocumentGroup: (key: CostType) => void;
};

export const useHeizkostenabrechnungStore =
  create<HeizkostenabrechnungStoreType>((set, get) => ({
    start_date: null,
    end_date: null,
    documentGroups: [],
    setStartDate: (date) => set({ start_date: date }),
    setEndDate: (date) => set({ end_date: date }),
    getFormattedDates: () => {
      const { start_date, end_date } = get();

      const formatDate = (date: Date | null): string =>
        date ? format(date, "dd.MM.yyyy") : "";

      return {
        start_date: formatDate(start_date),
        end_date: formatDate(end_date),
      };
    },
    addDocumentGroup: (group) =>
      set((state) => ({
        documentGroups: [...state.documentGroups, group],
      })),

    updateDocumentGroup: (key, documents) =>
      set((state) => ({
        documentGroups: state.documentGroups.map((group) =>
          group.key === key ? { ...group, documents } : group
        ),
      })),

    removeDocumentGroup: (key) =>
      set((state) => ({
        documentGroups: state.documentGroups.filter(
          (group) => group.key !== key
        ),
      })),
  }));
