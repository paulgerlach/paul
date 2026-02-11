import { DocCostCategoryType } from "@/types";

export const DEFAULT_HEATING_COST_TYPES: Partial<DocCostCategoryType>[] = [
    {
        name: "Brennstoffkosten",
        type: "fuel_costs",
        document_type: "heizkostenabrechnung",
    },
    {
        name: "Betriebsstrom",
        type: "operating_current",
        document_type: "heizkostenabrechnung",
    },
    {
        name: "Wartungskosten",
        type: "maintenance_costs",
        document_type: "heizkostenabrechnung",
    },
    {
        name: "Messdienstkosten",
        type: "metering_service_costs",
        document_type: "heizkostenabrechnung",
    },
    {
        name: "Miete der Messgeräte",
        type: "metering_device_rental",
        document_type: "heizkostenabrechnung",
    },
    {
        name: "Schornsteinfegerkosten",
        type: "chimney_sweep_costs",
        document_type: "heizkostenabrechnung",
    },
    {
        name: "Sonstige Betriebskosten",
        type: "other_operating_costs",
        document_type: "heizkostenabrechnung",
    },
];
