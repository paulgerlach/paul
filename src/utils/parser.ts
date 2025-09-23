import Papa from "papaparse";

type IVWhKey = `IV,${number},0,0,Wh,E`;
type IVVolKey = `IV,${number},0,0,m^3,Vol`;
type IVAccKey =
    "IV,1,0,0,m^3,Vol Accumulation abs value only if negative contributions (backward flow)";

export type MeterReadingBase = {
    "Frame Type": string;
    Manufacturer: string;
    ID: string;
    Version: string;
    "Device Type": "Heat" | "WWater" | "Water" | string;
    "TPL-Config": string;
    "Access Number": number;
    Status: string;
    Encryption: number;
    "IV,0,0,0,,Date/Time": string;
    "IV,0,0,0,Wh,E"?: number;
    "IV,0,0,0,m^3,Vol": number;
    "IV,0,0,0,,ErrorFlags(binary)(deviceType specific)": string;
    "IV,1,0,0,,Date": string;

    "IV,1,0,0,Wh,E"?: number;
    "IV,1,0,0,m^3,Vol"?: number;
    "IV,1,0,0,m^3,Vol Accumulation abs value only if negative contributions (backward flow)"?: number;

    "IV,3,0,0,Wh,E"?: number;
    "IV,3,0,0,m^3,Vol"?: number;
    "IV,5,0,0,Wh,E"?: number;
    "IV,5,0,0,m^3,Vol"?: number;
    "IV,7,0,0,Wh,E"?: number;
    "IV,7,0,0,m^3,Vol"?: number;
    "IV,9,0,0,Wh,E"?: number;
    "IV,9,0,0,m^3,Vol"?: number;
    "IV,11,0,0,Wh,E"?: number;
    "IV,11,0,0,m^3,Vol"?: number;
    "IV,13,0,0,Wh,E"?: number;
    "IV,13,0,0,m^3,Vol"?: number;
    "IV,15,0,0,Wh,E"?: number;
    "IV,15,0,0,m^3,Vol"?: number;
    "IV,17,0,0,Wh,E"?: number;
    "IV,17,0,0,m^3,Vol"?: number;
    "IV,19,0,0,Wh,E"?: number;
    "IV,19,0,0,m^3,Vol"?: number;
    "IV,21,0,0,Wh,E"?: number;
    "IV,21,0,0,m^3,Vol"?: number;
    "IV,23,0,0,Wh,E"?: number;
    "IV,23,0,0,m^3,Vol"?: number;
    "IV,25,0,0,Wh,E"?: number;
    "IV,25,0,0,m^3,Vol"?: number;
    "IV,27,0,0,Wh,E"?: number;
    "IV,27,0,0,m^3,Vol"?: number;
    "IV,29,0,0,Wh,E"?: number;
    "IV,29,0,0,m^3,Vol"?: number;
    "IV,31,0,0,Wh,E"?: number;
    "IV,31,0,0,m^3,Vol"?: number;

    "IV,0,0,0,Model/Version": number;
    "IV,0,0,0,,Parameter set ident": number;

    // Extra historical volume keys (as per your schema)
    "IV,2,0,0,m^3,Vol"?: number;
    "IV,4,0,0,m^3,Vol"?: number;
    "IV,6,0,0,m^3,Vol"?: number;
    "IV,8,0,0,m^3,Vol"?: number;
    "IV,10,0,0,m^3,Vol"?: number;
    "IV,12,0,0,m^3,Vol"?: number;
    "IV,14,0,0,m^3,Vol"?: number;
    "IV,16,0,0,m^3,Vol"?: number;
};

export type MeterReadingType =
    & MeterReadingBase
    & Partial<Record<IVWhKey, number>>
    & Partial<Record<IVVolKey, number>>
    & Partial<Record<IVAccKey, number>>;

export interface ParseResult {
    data: MeterReadingType[];
    errors: { row: number; error: string; rawRow: any }[];
}


const COLUMNS = {
    FRAME: "Frame Type",
    MANU: "Manufacturer",
    ID: "ID",
    VER: "Version",
    TYPE: "Device Type",
    TPL: "TPL-Config",
    ACCESS: "Access Number",
    STATUS: "Status",
    ENC: "Encryption",
    DT0: "IV,0,0,0,,Date/Time",
    VOL0: "IV,0,0,0,m^3,Vol",
    ERR0: "IV,0,0,0,,ErrorFlags(binary)(deviceType specific)",
    DT1: "IV,1,0,0,,Date",
    MODEL: "IV,0,0,0,Model/Version",
    PARSET: "IV,0,0,0,,Parameter set ident",
} as const;

const REQUIRED_COLS: string[] = [
    COLUMNS.FRAME, COLUMNS.MANU, COLUMNS.ID, COLUMNS.VER, COLUMNS.TYPE,
    COLUMNS.TPL, COLUMNS.ACCESS, COLUMNS.STATUS, COLUMNS.ENC,
    COLUMNS.DT0, COLUMNS.VOL0, COLUMNS.ERR0, COLUMNS.DT1,
    COLUMNS.MODEL, COLUMNS.PARSET,
];

const HEADER_SIGNATURE = [COLUMNS.FRAME, COLUMNS.MANU, COLUMNS.ID, COLUMNS.VER, COLUMNS.TYPE].join("|");
const WH_REGEX = /^IV,\d+,0,0,Wh,E$/;
const VOL_REGEX = /^IV,\d+,0,0,m\^3,Vol$/;
const DATE_REGEX = /^IV,\d+,0,0,,Date$/;


function asNumber(value?: string): number | undefined {
    if (!value && value !== "0") {
        return undefined;
    }

    // Handle German decimal format (comma as decimal separator)
    const normalized = value.replace(/\s+/g, "").replace(",", ".");

    // First try to parse as a normal number
    const n = Number(normalized);

    if (!Number.isFinite(n)) {
        return undefined;
    }

    // Only flag as error if it's actually problematic after parsing
    // Values like "99999,511" are valid German decimals (99999.511)
    return n;
}

function isRepeatedHeader(row: Record<string, string | undefined>): boolean {
    const sig = [COLUMNS.FRAME, COLUMNS.MANU, COLUMNS.ID, COLUMNS.VER, COLUMNS.TYPE]
        .map((c) => (row[c] ?? "").trim())
        .join("|");

    return sig === HEADER_SIGNATURE;
}

function pushErrorFactory(errors: ParseResult["errors"]) {
    const seen = new Set<string>();

    return (row: number, message: string, rawRow: any, field?: string) => {
        const key = `${row}|${field ?? ""}|${message}`;

        if (seen.has(key)) {
            return;
        }

        seen.add(key);
        errors.push({ row, error: message, rawRow });
    };
}

function validateMeterReading(reading: MeterReadingType, line: number, pushError: ReturnType<typeof pushErrorFactory>): void {
    // Validate that Heat devices have energy readings
    if (reading["Device Type"] === "Heat" && !reading["IV,0,0,0,Wh,E"]) {
        pushError(line, "Heat device missing energy reading (IV,0,0,0,Wh,E)", reading);
    }

    // Validate that Water/WWater devices have volume readings
    if ((reading["Device Type"] === "Water" || reading["Device Type"] === "WWater") && !reading["IV,0,0,0,m^3,Vol"]) {
        pushError(line, "Water device missing volume reading (IV,0,0,0,m^3,Vol)", reading);
    }

    // Check for reasonable value ranges
    const currentEnergy = reading["IV,0,0,0,Wh,E"];
    if (currentEnergy && (currentEnergy < 0 || currentEnergy > 100000000)) {
        pushError(line, `Energy reading outside reasonable range: ${currentEnergy} Wh`, reading);
    }

    const currentVolume = reading["IV,0,0,0,m^3,Vol"];
    if (currentVolume && (currentVolume < 0 || currentVolume > 100000)) {
        pushError(line, `Volume reading outside reasonable range: ${currentVolume} m³`, reading);
    }
}


export function parseCsv(csvText: string): ParseResult {
    const errors: ParseResult["errors"] = [];
    const data: MeterReadingType[] = [];
    const pushError = pushErrorFactory(errors);

    const parsed = Papa.parse<Record<string, string>>(csvText, {
        delimiter: ";",
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim(),
        transform: (v) => (typeof v === "string" ? v.trim() : v),
    });

    // Structural parser errors
    if (parsed.errors?.length) {
        parsed.errors.forEach((e) => {
            pushError((e.row ?? 0) + 1, `Parser: ${e.message}`, null, "PARSER");
        });
    }

    // Required columns check
    const foundCols = parsed.meta.fields ?? [];
    const missing = REQUIRED_COLS.filter((c) => !foundCols.includes(c));

    if (missing.length) {
        pushError(1, `Missing required column(s): ${missing.join(", ")}`, null, "COLUMNS");
    }

    (parsed.data ?? []).forEach((row, idx) => {
        const line = idx + 2; // header = line 1

        if (isRepeatedHeader(row)) {
            return;
        }

        // Populate basic fields
        const base: Partial<MeterReadingType> = {
            [COLUMNS.FRAME]: row[COLUMNS.FRAME] ?? "",
            [COLUMNS.MANU]: row[COLUMNS.MANU] ?? "",
            [COLUMNS.ID]: row[COLUMNS.ID] ?? "",
            [COLUMNS.VER]: row[COLUMNS.VER] ?? "",
            [COLUMNS.TYPE]: (row[COLUMNS.TYPE] ?? "") as MeterReadingType["Device Type"],
            [COLUMNS.TPL]: row[COLUMNS.TPL] ?? row["TPL Config"] ?? row["TPLConfig"] ?? "",
            [COLUMNS.STATUS]: row[COLUMNS.STATUS] ?? "",
            [COLUMNS.DT0]: row[COLUMNS.DT0] ?? "",
            [COLUMNS.ERR0]: row[COLUMNS.ERR0] ?? "",
            [COLUMNS.DT1]: row[COLUMNS.DT1] ?? "",
        };

        // Enhanced validation
        if (!base[COLUMNS.FRAME]) {
            pushError(line, "Missing Frame Type", row, COLUMNS.FRAME);
        } else if (base[COLUMNS.FRAME] !== "SND_NR") {
            pushError(line, `Unexpected Frame Type: ${base[COLUMNS.FRAME]} (expected SND_NR)`, row, COLUMNS.FRAME);
        }

        if (!base[COLUMNS.MANU]) {
            pushError(line, "Missing Manufacturer", row, COLUMNS.MANU);
        } else {
            // Validate known manufacturers
            const validManufacturers = ["EFE", "DWZ"];
            if (!validManufacturers.includes(base[COLUMNS.MANU] as string)) {
                pushError(line, `Unknown Manufacturer: ${base[COLUMNS.MANU]} (known: ${validManufacturers.join(", ")})`, row, COLUMNS.MANU);
            }
        }

        if (!base[COLUMNS.ID] || !/^\d+$/.test(String(base[COLUMNS.ID]))) {
            pushError(line, `Invalid ID (must be digits): "${base[COLUMNS.ID] ?? ""}"`, row, COLUMNS.ID);
        }

        if (!base[COLUMNS.TYPE]) {
            pushError(line, "Missing Device Type", row, COLUMNS.TYPE);
        } else {
            // Validate known device types
            const validDeviceTypes = ["Heat", "Water", "WWater"];
            if (!validDeviceTypes.includes(base[COLUMNS.TYPE] as string)) {
                pushError(line, `Unknown Device Type: ${base[COLUMNS.TYPE]} (known: ${validDeviceTypes.join(", ")})`, row, COLUMNS.TYPE);
            }
        }

        // Validate date format
        const dateTime = base[COLUMNS.DT0];
        if (dateTime && !dateTime.includes("invalid")) {
            const datePattern = /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}/;
            if (!datePattern.test(dateTime as string)) {
                pushError(line, `Invalid date format: ${dateTime} (expected DD.MM.YYYY HH:MM)`, row, COLUMNS.DT0);
            }
        }

        const result: Record<string, any> = { ...base };
        const handled = new Set<string>();

        const setNumeric = (colName: string, required = false) => {
            handled.add(colName);
            const raw = row[colName];

            if (raw == null || raw === "") {
                if (required) {
                    pushError(line, `Missing numeric field: ${colName}`, row, colName);
                }
                return;
            }

            const num = asNumber(raw);

            if (num === undefined) {
                pushError(line, `Invalid number in ${colName}: "${raw}"`, row, colName);
                // still add
                result[colName] = raw;
                return;
            }

            result[colName] = num;
        };

        // Required numeric
        setNumeric(COLUMNS.ACCESS, true);
        setNumeric(COLUMNS.ENC, true);
        setNumeric(COLUMNS.VOL0, true);
        setNumeric(COLUMNS.MODEL, true);
        setNumeric(COLUMNS.PARSET, true);

        // Optional (explicitly listed in base type)
        const OPTIONAL_NUMERIC_KEYS: readonly string[] = [
            "IV,0,0,0,Wh,E",
            "IV,1,0,0,Wh,E",
            "IV,1,0,0,m^3,Vol",
            "IV,1,0,0,m^3,Vol Accumulation abs value only if negative contributions (backward flow)",
            "IV,2,0,0,m^3,Vol",
            "IV,3,0,0,Wh,E",
            "IV,3,0,0,m^3,Vol",
            "IV,4,0,0,m^3,Vol",
            "IV,5,0,0,Wh,E",
            "IV,5,0,0,m^3,Vol",
            "IV,6,0,0,m^3,Vol",
            "IV,7,0,0,Wh,E",
            "IV,7,0,0,m^3,Vol",
            "IV,8,0,0,m^3,Vol",
            "IV,9,0,0,Wh,E",
            "IV,9,0,0,m^3,Vol",
            "IV,10,0,0,m^3,Vol",
            "IV,11,0,0,Wh,E",
            "IV,11,0,0,m^3,Vol",
            "IV,12,0,0,m^3,Vol",
            "IV,13,0,0,Wh,E",
            "IV,13,0,0,m^3,Vol",
            "IV,14,0,0,m^3,Vol",
            "IV,15,0,0,Wh,E",
            "IV,15,0,0,m^3,Vol",
            "IV,16,0,0,m^3,Vol",
            "IV,17,0,0,Wh,E",
            "IV,17,0,0,m^3,Vol",
            "IV,19,0,0,Wh,E",
            "IV,19,0,0,m^3,Vol",
            "IV,21,0,0,Wh,E",
            "IV,21,0,0,m^3,Vol",
            "IV,23,0,0,Wh,E",
            "IV,23,0,0,m^3,Vol",
            "IV,25,0,0,Wh,E",
            "IV,25,0,0,m^3,Vol",
            "IV,27,0,0,Wh,E",
            "IV,27,0,0,m^3,Vol",
            "IV,29,0,0,Wh,E",
            "IV,29,0,0,m^3,Vol",
            "IV,31,0,0,Wh,E",
            "IV,31,0,0,m^3,Vol",
        ];

        for (const key of OPTIONAL_NUMERIC_KEYS) {
            handled.add(key);

            const raw = row[key];

            if (!raw) {
                continue;
            }

            const num = asNumber(raw);

            if (num === undefined) {
                pushError(line, `Invalid number in ${key}: "${raw}"`, row, key);
                result[key] = raw;
            } else {
                result[key] = num;
            }
        }

        // Auto-detect any additional IV registers (Wh,E, m^3,Vol, and Date fields)
        for (const key of Object.keys(row)) {
            if (handled.has(key)) {
                continue;
            }

            if (!WH_REGEX.test(key) && !VOL_REGEX.test(key) && !DATE_REGEX.test(key)) {
                continue;
            }

            const raw = row[key];

            if (!raw) {
                continue;
            }

            // Handle date fields differently
            if (DATE_REGEX.test(key)) {
                result[key] = raw; // Keep dates as strings
                handled.add(key);
                continue;
            }

            const num = asNumber(raw);

            if (num === undefined) {
                // Only push error if we couldn't parse it as a German number
                pushError(line, `Invalid number in ${key}: "${raw}"`, row, key);
                result[key] = raw;
            } else {
                // Successfully parsed - but check if it might be an error code
                // Only flag very specific patterns that are clearly error codes
                if (num > 99999 && Number.isInteger(num) && key.includes("m^3,Vol")) {
                    pushError(line, `Suspicious value detected (possible error code) in ${key}: "${raw}"`, row, key);
                }
                result[key] = num;
            }

            handled.add(key);
        }

        // include any other unlisted columns as raw strings
        for (const key of Object.keys(row)) {
            if (handled.has(key)) {
                continue; // skip already processed
            }

            if (!row[key]) {
                continue; // skip empty
            }

            result[key] = row[key]; // keep raw string
        }

        data.push(result as MeterReadingType);

        // Validate the completed reading
        validateMeterReading(result as MeterReadingType, line, pushError);
    });

    return { data, errors };
}

// Utility function to extract date from German date string
export function parseGermanDate(dateString: string): Date | null {
    if (!dateString || dateString.includes("invalid")) {
        return null;
    }

    // Extract just the date part (DD.MM.YYYY)
    const dateMatch = dateString.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
    if (!dateMatch) {
        return null;
    }

    const [, day, month, year] = dateMatch;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    // Validate the date
    if (isNaN(date.getTime())) {
        return null;
    }

    return date;
}

// Utility function to get historical values for a specific meter
export function getHistoricalValues(reading: MeterReadingType, valueType: "Wh,E" | "m^3,Vol"): { month: number; value: number }[] {
    const values: { month: number; value: number }[] = [];

    for (let i = 0; i <= 30; i += 2) {
        const key = `IV,${i},0,0,${valueType}` as keyof MeterReadingType;
        const value = reading[key];

        if (typeof value === "number") {
            values.push({ month: i / 2, value });
        }
    }

    return values.reverse(); // Most recent first
}

// Utility function to detect data anomalies
export function detectAnomalies(reading: MeterReadingType): string[] {
    const anomalies: string[] = [];

    // Check for backwards flow indicators
    const backwardFlow = reading["IV,1,0,0,m^3,Vol Accumulation abs value only if negative contributions (backward flow)"];
    if (backwardFlow && backwardFlow > 0) {
        anomalies.push("Backward flow detected");
    }

    // Check for suspiciously high values (likely error codes)
    Object.entries(reading).forEach(([key, value]) => {
        if (typeof value === "number" && value > 99999 && key.includes("m^3,Vol")) {
            anomalies.push(`Suspicious volume reading in ${key}: ${value}`);
        }
    });

    return anomalies;
}