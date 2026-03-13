import { ParsedRecord } from "./models.ts";

const CONFIG = {
  DELIMITER: ";",
  INTEGER_REGEX: /^-?\d+$/,
  FLOAT_REGEX: /^-?\d+[,.]?\d*$/,
} as const;

export class Utils {
  /**
   * Convert string value to appropriate data type
   */
  static convertValue(value: string): string | number {
    if (!value || value === "") return value;

    // Check if it's an integer
    if (CONFIG.INTEGER_REGEX.test(value)) {
      return parseInt(value, 10);
    }

    // Check if it's a float (with comma or dot as decimal separator)
    if (CONFIG.FLOAT_REGEX.test(value.replace(",", "."))) {
      try {
        const floatValue = parseFloat(value.replace(",", "."));
        if (!isNaN(floatValue)) {
          return floatValue;
        }
      } catch (_e) {
        // Keep as string if conversion fails
      }
    }

    return value;
  }

  /**
   * Fields that should ALWAYS be kept as strings to preserve formatting (e.g. leading zeros)
   * Device IDs, meter numbers, and version/status fields must not be converted to numbers
   */
  static readonly KEEP_AS_STRING_FIELDS = new Set([
    "ID",
    "Number Meter",
    "Number Meter:",
    "Number Customer",
    "Number Customer:",
    "Version",
    "Status",
    "StatusByte",
    "StatusByte:",
    "AES Key",
    "AESKey",
    "AESKey:",
    "Frame Type",
    "Number Route",
    "Number Route:",
    "Number Estate",
    "Number Estate:",
    "Number Entrance",
    "Number Entrance:",
    "Number Building Unit",
    "Number Building Unit:",
    "Unit Number",
    "Unitnumber",
    "Unitnumber:",
  ]);

  /**
   * Parse a single CSV record from header and data lines
   */
  static parseRecord(headerLine: string, dataLine: string): ParsedRecord {
    const headers = headerLine.split(CONFIG.DELIMITER);
    const values = dataLine.split(CONFIG.DELIMITER);
    const record: ParsedRecord = {};

    headers.forEach((header, index) => {
      if (index < values.length) {
        const cleanHeader = header.trim();
        const rawValue = values[index].trim();
        // Keep ID/meter fields as strings to preserve leading zeros
        if (this.KEEP_AS_STRING_FIELDS.has(cleanHeader)) {
          record[cleanHeader] = rawValue;
        } else {
          record[cleanHeader] = this.convertValue(rawValue);
        }
      }
    });

    return record;
  }

  /**
   * Process CSV content into records
   * Handles VERTICAL CSV format: alternating header-data pairs (Engelmann Gateway format)
   * Each device type has its own header line followed by its data line
   */
  static processCSVContent(fileContent: string): ParsedRecord[] {
    const lines = fileContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    if (lines.length < 2) {
      console.log(
        "Not enough lines in CSV (need at least header + 1 data row)",
      );
      return [];
    }

    const records: ParsedRecord[] = [];

    // Process lines in pairs: header line followed by data line
    // Line 0: Header for device 1
    // Line 1: Data for device 1
    // Line 2: Header for device 2
    // Line 3: Data for device 2
    // etc.
    for (let i = 0; i < lines.length - 1; i += 2) {
      const headerLine = lines[i];
      const dataLine = lines[i + 1];

      if (headerLine && dataLine) {
        const record = this.parseRecord(headerLine, dataLine);
        records.push(record);
      }
    }

    console.log(
      `[VERTICAL FORMAT] Processed ${records.length} records from ${
        lines.length / 2
      } header-data pairs`,
    );
    return records;
  }
}
