import type { DialogDocumentActionType } from "@/types";
import { create } from "zustand";

export type DialogStoreType = {
  openDialogByType: Record<DialogDocumentActionType, boolean>;
  itemID: string | undefined;
  setItemID: (id: string | undefined) => void;
  isOpen: boolean;
  openDialog: (type: DialogDocumentActionType) => void;
  closeDialog: (type: DialogDocumentActionType) => void;
  toggleDialog: (type: DialogDocumentActionType) => void;
};

export const useDialogStore = create<DialogStoreType>((set) => ({
  itemID: undefined,
  isOpen: false,
  openDialogByType: {
    object_delete: false,
    local_delete: false,
    contract_delete: false,
    heating_bill_delete: false,
    object_create: false,
    local_create: false,
    contract_create: false,
    heating_bill_create: false,
    login: false,
    register: false,
  },

  setItemID: (id) => set({ itemID: id }),

  openDialog: (type) =>
    set((s) => ({
      openDialogByType: { ...s.openDialogByType, [type]: true },
    })),

  closeDialog: (type) =>
    set((s) => ({
      openDialogByType: { ...s.openDialogByType, [type]: false },
      itemID: undefined,
    })),

  toggleDialog: (type) =>
    set((s) => ({
      openDialogByType: {
        ...s.openDialogByType,
        [type]: !s.openDialogByType[type],
      },
    })),
}));
