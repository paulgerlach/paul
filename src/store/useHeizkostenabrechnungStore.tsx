import { create } from "zustand";
import { format } from "date-fns";
import type { DocCostCategoryType, InvoiceDocumentType } from "@/types";
import { de } from "date-fns/locale";

export type HeizkostenabrechnungCostType = Partial<DocCostCategoryType> & {
  data: (Partial<InvoiceDocumentType> & { document?: File[] })[];
};

export type HeizkostenabrechnungStoreType = {
  start_date: Date | null;
  end_date: Date | null;
  activeCostType: HeizkostenabrechnungCostType["type"] | null;
  documentGroups: HeizkostenabrechnungCostType[];
  setDocumentGroups: (groups: HeizkostenabrechnungCostType[]) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  getFormattedDates: () => { start_date: string; end_date: string };
  addDocumentGroup: (group: HeizkostenabrechnungCostType) => void;
  updateDocumentGroup: (
    key: HeizkostenabrechnungCostType["type"],
    newItem: Partial<InvoiceDocumentType> & { document?: File[] }
  ) => void;
  removeDocumentGroup: (key: HeizkostenabrechnungCostType["type"]) => void;
  purposeOptions: string[];
  setActiveCostType: (key: HeizkostenabrechnungCostType["type"]) => void;
  objektID?: string;
  operatingDocID?: string;
  localID: string | null;
  setObjektID: (id: string) => void;
  setLocalID: (id: string) => void;
  setOperatingDocID: (id: string) => void;
  updateDocumentGroupValues: (
    key: HeizkostenabrechnungCostType["type"],
    index: number,
    values: Partial<InvoiceDocumentType> & { document?: File }
  ) => void;
  getDocumentGroupByType: (
    key: HeizkostenabrechnungCostType["type"]
  ) => HeizkostenabrechnungCostType | undefined;
  updateAllocationKey: (
    key: HeizkostenabrechnungCostType["type"],
    allocationKey: HeizkostenabrechnungCostType["allocation_key"]
  ) => void;
  setPurposeOptions: () => void;
};

export const useHeizkostenabrechnungStore =
  create<HeizkostenabrechnungStoreType>((set, get) => ({
    start_date: new Date(new Date().getFullYear(), 0, 1),
    end_date: null,
    activeCostType: null,
    documentGroups: [],
    objektID: undefined,
    operatingDocID: undefined,
    localID: null,
    purposeOptions: [],
    setDocumentGroups: (groups) =>
      set({
        documentGroups: groups,
      }),
    setLocalID: (id) =>
      set(() => ({
        localID: id,
      })),
    setOperatingDocID: (id) =>
      set(() => ({
        operatingDocID: id,
      })),
    setObjektID: (id) =>
      set(() => ({
        objektID: id,
      })),
    setActiveCostType: (key) => {
      set(() => ({
        activeCostType: key,
      }));
    },
    getDocumentGroupByType: (key: HeizkostenabrechnungCostType["type"]) => {
      const { documentGroups } = get();
      return documentGroups.find((group) => group.type === key);
    },
    setStartDate: (date) => set({ start_date: date }),
    setEndDate: (date) => set({ end_date: date }),
    getFormattedDates: () => {
      const { start_date, end_date } = get();

      const formatDate = (date: Date | null): string =>
        date ? format(date, "dd.MM.yyyy", { locale: de }) : "";

      return {
        start_date: formatDate(start_date),
        end_date: formatDate(end_date),
      };
    },
    addDocumentGroup: (group) =>
      set((state) => {
        if (state.documentGroups.some((g) => g.type === group.type))
          return state;
        return { documentGroups: [...state.documentGroups, group] };
      }),
    updateDocumentGroup: (key, newItem) =>
      set((state) => ({
        documentGroups: state.documentGroups.map((group) =>
          group.type === key
            ? { ...group, data: [...group.data, newItem] }
            : group
        ),
      })),
    updateDocumentGroupValues: (key, index, values) =>
      set((state) => ({
        documentGroups: state.documentGroups.map((group) =>
          group.type === key
            ? {
                ...group,
                data: group.data.map((item, i) =>
                  i === index
                    ? {
                        ...item,
                        ...values,
                        document: values.document
                          ? [...(item.document ?? []), values.document].flat()
                          : item.document,
                      }
                    : item
                ),
              }
            : group
        ),
      })),
    removeDocumentGroup: (key) =>
      set((state) => ({
        documentGroups: state.documentGroups.filter(
          (group) => group.type !== key
        ),
      })),
    updateAllocationKey: (key, allocationKey) =>
      set((state) => ({
        documentGroups: state.documentGroups.map((group) =>
          group.type === key
            ? { ...group, allocation_key: allocationKey }
            : group
        ),
      })),
    setPurposeOptions: () => {
      const { documentGroups, activeCostType } = get();
      const options = documentGroups.find(
        (group) => group.type === activeCostType
      )?.options;
      set({
        purposeOptions: options ?? [],
      });
    },
  }));
