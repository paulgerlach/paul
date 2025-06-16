import { create } from "zustand";
import { format } from "date-fns";
import type { CostTypeKey, HeatingBillDocumentType } from "@/types";
import { costTypePurposeMap } from "@/static/formSelectOptions";

export type HeizkostenabrechnungCostType = {
  type: CostTypeKey;
  data: (Partial<HeatingBillDocumentType> & { document?: File[] })[];
  allocation_key: "Verbrauch" | "m2 Wohnfläche" | "Wohneinheiten";
};

export type HeizkostenabrechnungStoreType = {
  start_date: Date | null;
  end_date: Date | null;
  activeCostType: CostTypeKey | null;
  documentGroups: HeizkostenabrechnungCostType[];
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  getFormattedDates: () => { start_date: string; end_date: string };
  addDocumentGroup: (group: HeizkostenabrechnungCostType) => void;
  updateDocumentGroup: (
    key: CostTypeKey,
    newItem: Partial<HeatingBillDocumentType> & { document?: File[] }
  ) => void;
  removeDocumentGroup: (key: CostTypeKey) => void;
  purposeOptions: string[];
  setPurposeOptions: () => void;
  setActiveCostType: (key: CostTypeKey) => void;
  objektID: string | null;
  localID: string | null;
  setObjektID: (id: string) => void;
  setLocalID: (id: string) => void;
  updateDocumentGroupValues: (
    key: CostTypeKey,
    index: number,
    values: Partial<HeatingBillDocumentType> & { document?: File }
  ) => void;
  getDocumentGroupByType: (
    key: CostTypeKey
  ) => HeizkostenabrechnungCostType | undefined;
  updateAllocationKey: (
    key: CostTypeKey,
    allocationKey: HeizkostenabrechnungCostType["allocation_key"]
  ) => void;
};

export const useHeizkostenabrechnungStore =
  create<HeizkostenabrechnungStoreType>((set, get) => ({
    start_date: null,
    end_date: null,
    activeCostType: null,
    documentGroups: [
      {
        type: "fuel_costs",
        data: [],
        allocation_key: "m2 Wohnfläche",
      },
      {
        type: "operating_current",
        data: [],
        allocation_key: "Verbrauch",
      },
      {
        type: "maintenance_costs",
        data: [],
        allocation_key: "m2 Wohnfläche",
      },
      {
        type: "metering_service_costs",
        data: [],
        allocation_key: "Verbrauch",
      },
      {
        type: "metering_device_rental",
        data: [],
        allocation_key: "Verbrauch",
      },
      {
        type: "chimney_sweep_costs",
        data: [],
        allocation_key: "Verbrauch",
      },
      {
        type: "other_operating_costs",
        data: [],
        allocation_key: "Wohneinheiten",
      },
    ],
    objektID: null,
    localID: null,
    purposeOptions: [],
    setPurposeOptions: () => {
      const { activeCostType } = get();
      if (activeCostType !== null) {
        const options = costTypePurposeMap[activeCostType] ?? [];
        set(() => ({
          purposeOptions: options,
        }));
      }
    },
    setLocalID: (id) =>
      set(() => ({
        localID: id,
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
    getDocumentGroupByType: (key: CostTypeKey) => {
      const { documentGroups } = get();
      return documentGroups.find((group) => group.type === key);
    },
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
  }));
