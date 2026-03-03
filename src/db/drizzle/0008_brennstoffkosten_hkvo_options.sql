-- Migration: 0008_brennstoffkosten_hkvo_options
-- Description: Update Brennstoffkosten default options to expanded energy types
--              aligned with HKVO (Heizkostenverordnung) factors.

UPDATE doc_cost_category_defaults
SET options = ARRAY[
  'Erdgas (Brennwert)',
  'Erdgas (Heizwert)',
  'Heizöl EL',
  'Flüssiggas (LPG)',
  'Fernwärme',
  'Nahwärme (BHKW)',
  'Pellets',
  'Holzhackschnitzel',
  'Wärmepumpe (Strom)',
  'Stromdirektheizung'
]::text[]
WHERE name = 'Brennstoffkosten';
