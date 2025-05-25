import { create } from "zustand";

export type DeleteDialogStoreType = {
  openDialog: () => void;
  closeDialog: () => void;
  setDialogID: (id: string) => void;
  dialogID: string;
  itemID: string;
  setItemID: (id: string) => void;
};

export const useDeleteDialogStore = create<DeleteDialogStoreType>(
  (set, get) => ({
    dialogID: "",
    itemID: "",
    setItemID: (id: string) => {
      set(() => ({
        itemID: id,
      }));
    },
    openDialog: () => {
      const dialog: HTMLDialogElement | null = document.getElementById(
        get().dialogID
      ) as HTMLDialogElement | null;
      if (dialog) {
        dialog.showModal();
      }
    },
    closeDialog: () => {
      const dialog: HTMLDialogElement | null = document.getElementById(
        get().dialogID
      ) as HTMLDialogElement | null;
      if (dialog) {
        dialog.close();
      }
    },
    setDialogID(id: string) {
      set(() => ({
        dialogID: id,
      }));
    },
  })
);
