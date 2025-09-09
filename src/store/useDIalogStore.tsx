import type { DialogStoreActionType } from "@/types";
import { create } from "zustand";

export type DialogStoreType = {
  openDialogByType: Record<DialogStoreActionType, boolean>;
  itemID: string | undefined;
  setItemID: (id: string | undefined) => void;
  isOpen: boolean;
  queryKey?: string[];
  setQueryKey: (keys: string[]) => void;
  openDialog: (type: DialogStoreActionType) => void;
  closeDialog: (type: DialogStoreActionType) => void;
  toggleDialog: (type: DialogStoreActionType) => void;
};

export const useDialogStore = create<DialogStoreType>((set) => ({
  itemID: undefined,
  isOpen: false,
  queryKey: [],
  openDialogByType: {
    object_delete: false,
    share_dashboard: false,
    admin_object_delete: false,
    object_edit: false,
    admin_object_edit: false,
    local_delete: false,
    admin_local_delete: false,
    local_edit: false,
    admin_local_edit: false,
    contract_delete: false,
    admin_contract_delete: false,
    contract_edit: false,
    admin_contract_edit: false,
    heating_bill_delete: false,
    admin_heating_bill_delete: false,
    heating_bill_edit: false,
    admin_heating_bill_edit: false,
    operating_costs_delete: false,
    admin_operating_costs_delete: false,
    admin_operating_costs_edit: false,
    operating_costs_edit: false,
    object_create: false,
    local_create: false,
    contract_create: false,
    heating_bill_create: false,
    admin_heating_bill_create: false,
    operating_costs_create: false,
    admin_operating_costs_create: false,
    login: false,
    register: false,
    forgotPassword: false,
    admin_objekte_image: false,
    // building_cleaning_upload: false,
    // caretaker_upload: false,
    // chimney_sweep_costs_upload: false,
    // cold_water_upload: false,
    // elevator_upload: false,
    // fuel_costs_upload: false,
    // garden_care_upload: false,
    // heating_costs_upload: false,
    // hot_water_supply_upload: false,
    // liability_insurance_upload: false,
    // lighting_upload: false,
    // maintenance_costs_upload: false,
    // metering_device_rental_upload: false,
    // metering_service_costs_upload: false,
    // operating_current_upload: false,
    // other_operating_costs_upload: false,
    // property_tax_upload: false,
    // street_cleaning_upload: false,
    // waste_disposal_upload: false,
    // wastewater_upload: false,
    cost_type_heizkostenabrechnung_create: false,
    cost_type_heizkostenabrechnung_delete: false,
    cost_type_heizkostenabrechnung_edit: false,
    cost_type_betriebskostenabrechnung_create: false,
    cost_type_betriebskostenabrechnung_delete: false,
    cost_type_betriebskostenabrechnung_edit: false,
    admin_cost_type_heizkostenabrechnung_create: false,
    admin_cost_type_heizkostenabrechnung_delete: false,
    admin_cost_type_heizkostenabrechnung_edit: false,
    admin_cost_type_betriebskostenabrechnung_create: false,
    admin_cost_type_betriebskostenabrechnung_delete: false,
    admin_cost_type_betriebskostenabrechnung_edit: false,
    admin_contract_create: false,
    admin_local_create: false,
    admin_object_create: false,
    shareModal: false,
    shareExtendedModal: false,
  },
  setQueryKey: (keys) => set({ queryKey: keys }),
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
