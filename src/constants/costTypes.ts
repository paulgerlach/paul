import { DocCostCategoryType } from "@/types";

export const DEFAULT_HEATING_COST_TYPES: Partial<DocCostCategoryType>[] = [
    {
        name: "Brennstoffkosten",
        type: "fuel_costs",
        document_type: "heizkostenabrechnung",
        options: [
            "Erdgas (Brennwert)",
            "Erdgas (Heizwert)",
            "Heizöl EL",
            "Flüssiggas (LPG)",
            "Fernwärme",
            "Nahwärme (BHKW)",
            "Pellets",
            "Holzhackschnitzel",
            "Wärmepumpe (Strom)",
            "Stromdirektheizung",
        ],
    },
    {
        name: "Betriebsstrom",
        type: "operating_current",
        document_type: "heizkostenabrechnung",
        options: ["Strom für Umwälzpumpen", "Regeltechnik"],
    },
    {
        name: "Wartungskosten",
        type: "maintenance_costs",
        document_type: "heizkostenabrechnung",
        options: ["Regelmäßige Wartung der Heizungsanlage (z. B. Brennerprüfung)", "Reinigung"],
    },
    {
        name: "Messdienstkosten",
        type: "metering_service_costs",
        document_type: "heizkostenabrechnung",
        options: ["Ablesung", "Auswertung", "Gerätebereitstellung"],
    },
    {
        name: "Miete der Messgeräte",
        type: "metering_device_rental",
        document_type: "heizkostenabrechnung",
        options: ["Heizkostenverteiler", "Wärmemengenzähler", "Warmwasserzähler", "Kaltwasserzähler", "Kältezähler"],
    },
    {
        name: "Schornsteinfegerkosten",
        type: "chimney_sweep_costs",
        document_type: "heizkostenabrechnung",
        options: ["Kosten für die Emissionsmessung", "Nur der auf die Heizung entfallende Teil"],
    },
    {
        name: "Sonstige Betriebskosten",
        type: "other_operating_costs",
        document_type: "heizkostenabrechnung",
        options: ["Z. B. Legionellenprüfung bei Warmwasserbereitung", "Kosten für die Reinigung des Heizraums"],
    },
];
