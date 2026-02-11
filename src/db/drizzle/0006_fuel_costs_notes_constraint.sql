-- Migration: 0006_fuel_costs_notes_constraint
-- Description: Ensure Brennstoffkosten (fuel_costs, brennstoffkosten) cost types
--              only accept numeric values in the notes field (Menge in kWh)

ALTER TABLE heating_invoices
ADD CONSTRAINT heating_invoices_fuel_costs_notes_numeric
CHECK (
  cost_type NOT IN ('fuel_costs', 'brennstoffkosten')
  OR (notes IS NOT NULL AND notes ~ '^\d+(\.\d+)?$')
);
