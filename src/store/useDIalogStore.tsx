import type { DialogDocumentActonType } from "@/types";
import { create } from "zustand";

export type DialogStoreType = {
  openDialogByType: Record<DialogDocumentActonType, boolean>;
  itemID: string | null;
  setItemID: (id: string | null) => void;
  isOpen: boolean;
  openDialog: (type: DialogDocumentActonType) => void;
  closeDialog: (type: DialogDocumentActonType) => void;
  toggleDialog: (type: DialogDocumentActonType) => void;
};

export const useDialogStore = create<DialogStoreType>((set) => ({
  itemID: null,
  isOpen: false,
  openDialogByType: {
    object_delete: false,
    local_delete: false,
    tenant_delete: false,
    heating_bill_delete: false,
    object_create: false,
    local_create: false,
    tenant_create: false,
    heating_bill_create: false,
  },

  setItemID: (id) => set({ itemID: id }),

  openDialog: (type) =>
    set((s) => ({
      openDialogByType: { ...s.openDialogByType, [type]: true },
    })),

  closeDialog: (type) =>
    set((s) => ({
      openDialogByType: { ...s.openDialogByType, [type]: false },
      itemID: null,
    })),

  toggleDialog: (type) =>
    set((s) => ({
      openDialogByType: {
        ...s.openDialogByType,
        [type]: !s.openDialogByType[type],
      },
    })),
}));
