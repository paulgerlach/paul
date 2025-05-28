import { create } from "zustand";

export type DialogActionTYpe = "delete";

export type DocumentType = "object" | "local" | "tenant";

export type DialogDocumentActonType = `${DocumentType}_${DialogActionTYpe}`;

export type DeleteDialogStoreType = {
  openDialogByType: Record<DialogDocumentActonType, boolean>;
  itemID: string | null;
  setItemID: (id: string | null) => void;
  isOpen: boolean;
  openDialog: (type: DialogDocumentActonType) => void;
  closeDialog: (type: DialogDocumentActonType) => void;
  toggleDialog: (type: DialogDocumentActonType) => void;
};

export const useDeleteDialogStore = create<DeleteDialogStoreType>((set) => ({
  itemID: null,
  isOpen: false,
  openDialogByType: {
    object_delete: false,
    local_delete: false,
    tenant_delete: false,
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
