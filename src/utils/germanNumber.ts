/**
 * German number formatting utilities
 *
 * German locale uses comma as decimal separator and dot as thousands separator.
 * e.g. "1.234,56" = 1234.56
 *
 * These utilities handle input normalization so German users can type naturally
 * while the system stores standard numeric values.
 */

/**
 * Parse a German-formatted number string to a standard number.
 * Accepts both German (comma) and English (period) decimal separators.
 *
 * "1.234,56" → 1234.56
 * "1,5"      → 1.5
 * "1.5"      → 1.5
 * "100"      → 100
 * ""         → null
 */
export function parseGermanDecimal(value: string): number | null {
  if (!value || value.trim() === "") return null;

  const trimmed = value.trim();

  // Determine format by looking at last separator
  const lastComma = trimmed.lastIndexOf(",");
  const lastDot = trimmed.lastIndexOf(".");

  let normalized: string;

  if (lastComma > lastDot) {
    // German format: "1.234,56" → remove dots (thousands), replace comma with period
    normalized = trimmed.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > lastComma) {
    // English format or no comma: "1,234.56" → remove commas (thousands)
    normalized = trimmed.replace(/,/g, "");
  } else {
    // No separators at all: "100"
    normalized = trimmed;
  }

  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
}

/**
 * Format a number to German display format.
 *
 * 1234.56 → "1.234,56"
 * 1.5     → "1,50"
 * 100     → "100,00"
 */
export function formatGermanDecimal(
  value: number,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2
): string {
  return value.toLocaleString("de-DE", {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

/**
 * Normalize a raw input string for form storage.
 * Converts German comma decimals to period decimals for the form value.
 *
 * "1,5"      → "1.5"
 * "1.234,56" → "1234.56"
 * "1.5"      → "1.5"  (already correct)
 * ""         → ""
 *
 * Returns the string representation (not a number) so react-hook-form
 * can handle it properly without losing trailing decimals during editing.
 */
export function normalizeDecimalInput(value: string): string {
  if (!value || value.trim() === "") return "";

  const trimmed = value.trim();

  // Allow typing in progress: if the string ends with a comma or period, keep it
  if (trimmed.endsWith(",") || trimmed.endsWith(".")) {
    return trimmed.replace(",", ".");
  }

  const parsed = parseGermanDecimal(trimmed);
  if (parsed === null) return "";

  return String(parsed);
}

/**
 * Validate that a string can be parsed as a decimal number.
 * Accepts both German and English formats.
 */
export function isValidDecimal(value: string): boolean {
  if (!value || value.trim() === "") return true; // empty is valid (not required)
  return parseGermanDecimal(value) !== null;
}
