/**
 * Physical constants, CO2 tier table, cost type mappings for Heizkostenabrechnung.
 */

// Fuel/energy invoices (carry kWh data) -- Page 2 energy table
export const ENERGY_COST_TYPES = ["fuel_costs", "brennstoffkosten"] as const;

// Heating operating costs -- Page 2 heating costs table
export const HEATING_OPERATING_TYPES = [
  "operating_current", // Betriebsstrom
  "maintenance_costs", // Wartungskosten
  "chimney_sweep_costs", // Schornsteinfegerkosten
  "other_operating_costs", // Sonstige Betriebskosten
] as const;

// Distribution/metering costs -- Page 2 distribution table
export const DISTRIBUTION_COST_TYPES = [
  "metering_device_rental", // Miete der Messgeräte
  "metering_service_costs", // Messdienstkosten
] as const;

// Cold water costs -- Page 3 (all go to coldWaterInvoices for rate breakdown)
export const COLD_WATER_COST_TYPES = [
  "cold_water",
  "cold_water_device_rental",
  "abwasser",
  "cold_water_billing",
] as const;

// Cold water subcategories for rate breakdown (cost_type or purpose keywords -> label, unit, allocation)
export const COLD_WATER_SUBTYPE_MAP: Record<
  string,
  { label: string; unit: "m3" | "nutzeinh"; decimals: number }
> = {
  cold_water: { label: "Kaltwasser", unit: "m3", decimals: 6 },
  kaltwasser: { label: "Kaltwasser", unit: "m3", decimals: 6 },
  abwasser: { label: "Abwasser Gesamt", unit: "m3", decimals: 6 },
  sewage: { label: "Abwasser Gesamt", unit: "m3", decimals: 6 },
  cold_water_device_rental: { label: "Gerätemiete Kaltwasser", unit: "m3", decimals: 6 },
  gerätemiete_kaltwasser: { label: "Gerätemiete Kaltwasser", unit: "m3", decimals: 6 },
  cold_water_billing: { label: "Abrechnung Kaltwasser", unit: "nutzeinh", decimals: 2 },
  abrechnung_kaltwasser: { label: "Abrechnung Kaltwasser", unit: "nutzeinh", decimals: 2 },
};

// Test types to ignore
export const IGNORED_COST_TYPES = [
  "heidi_systems_sd",
  "test_cost",
  "test_archived",
] as const;

// Warm water formula constants (HeizKV)
export const WARM_WATER_CONSTANT_FACTOR = 2.5; // kWh/m³/K
export const WARM_WATER_TEMP_DIFF_HIGH = 60; // °C
export const WARM_WATER_TEMP_DIFF_LOW = 10; // °C
export const WARM_WATER_CONVERSION_FACTOR = 1.15;

// Default base/consumption split (%)
export const DEFAULT_LIVING_SPACE_SHARE = 30;
export const DEFAULT_CONSUMPTION_DEPENDENT = 70;

// CO2KostAufG tier table: emission kg/m²/a -> { tenantPercent, landlordPercent }
export const CO2_TIER_TABLE: Array<{
  minEmissionPerM2: number;
  maxEmissionPerM2: number;
  tenantPercent: number;
  landlordPercent: number;
}> = [
  { minEmissionPerM2: 0, maxEmissionPerM2: 12, tenantPercent: 100, landlordPercent: 0 },
  { minEmissionPerM2: 12, maxEmissionPerM2: 17, tenantPercent: 90, landlordPercent: 10 },
  { minEmissionPerM2: 17, maxEmissionPerM2: 22, tenantPercent: 80, landlordPercent: 20 },
  { minEmissionPerM2: 22, maxEmissionPerM2: 27, tenantPercent: 70, landlordPercent: 30 },
  { minEmissionPerM2: 27, maxEmissionPerM2: 32, tenantPercent: 60, landlordPercent: 40 },
  { minEmissionPerM2: 32, maxEmissionPerM2: 37, tenantPercent: 50, landlordPercent: 50 },
  { minEmissionPerM2: 37, maxEmissionPerM2: 42, tenantPercent: 40, landlordPercent: 60 },
  { minEmissionPerM2: 42, maxEmissionPerM2: 47, tenantPercent: 30, landlordPercent: 70 },
  { minEmissionPerM2: 47, maxEmissionPerM2: 52, tenantPercent: 20, landlordPercent: 80 },
  { minEmissionPerM2: 52, maxEmissionPerM2: Infinity, tenantPercent: 5, landlordPercent: 95 },
];

// CO2 emission factors by energy carrier (kg CO2/kWh)
export const CO2_EMISSION_FACTORS: Record<string, number> = {
  "Nah-/Fernwärme": 0.2101,
  "Nah-/Fernwarme": 0.2101,
  Fernwärme: 0.2101,
  Nahwärme: 0.2101,
  Gas: 0.202,
  Öl: 0.266,
  default: 0.2101,
};

// National average kWh/m² for energy summary (DIN reference)
export const NATIONAL_AVERAGE_KWH_PER_M2 = 92.9;
