import { ParsedRecord } from "../types.ts";

/**
 * Extract date from filename pattern: Worringerestrasse86_YYYYMMDD_YYYYMMDD.csv
 * Also supports .txt files (e.g. DeutschenGasse468307_20260211_20260212.txt)
 * Returns the FIRST date (start date) in YYYY-MM-DD format
 */
export function extractDateFromFilename(fileName: string): string | null {
    if (!fileName) return null;

    // Match pattern: anything_YYYYMMDD_YYYYMMDD.csv/.txt or anything_YYYYMMDD.csv/.txt
    const filenameMatch = fileName.match(/_(\d{8})(?:_\d{8})?\.(?:csv|txt)$/i);
    if (filenameMatch) {
        const dateStr = filenameMatch[1]; // e.g., "20251104"
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const parsedDate = `${year}-${month}-${day}`;
        console.log(`[FILENAME DATE] Extracted date from filename "${fileName}": ${parsedDate}`);
        return parsedDate;
    }

    return null;
}


/**
 * Helper function to extract and normalize date to YYYY-MM-DD format
 * Handles multiple date formats: DD.MM.YYYY, DD-MM-YYYY
 * Falls back to filename date if no date found in CSV content
 */
export function extractDateOnly(record: ParsedRecord, fileName?: string): string | null {
    const deviceId = record['ID'] || record['Number Meter'] || 'unknown';
    const deviceType = record['Device Type'] || 'unknown';

    // 🔍 DEBUG: Log what we're working with
    console.log(`[DATE EXTRACT START] Device: ${deviceId}, Type: ${deviceType}, Filename: "${fileName}"`);

    // 🔥 NEW: For Electricity, ALWAYS use filename (CSV has no date field)
    if (deviceType === 'Elec' || deviceType === 'Stromzähler') {
        console.log(`[ELECTRICITY PRIORITY] Using filename for Electricity device`);
        if (fileName) {
            const filenameDate = extractDateFromFilename(fileName);
            if (filenameDate) {
                console.log(`[DATE SUCCESS FILENAME] Electricity using filename date: ${filenameDate}`);
                return filenameDate;
            } else {
                console.error(`[DATE FAIL FILENAME] Filename doesn't match pattern: "${fileName}"`);
            }
        } else {
            console.error(`[DATE FAIL] No filename provided for Electricity!`);
        }
        // If filename fails, fall through to try CSV dates (unlikely to exist but worth trying)
    } else if (deviceType === 'HCA') {
        const hcaDateTime = record['IV,0,0,0,,Date/Time'];
        if (hcaDateTime && typeof hcaDateTime === 'string') {
            console.log(`[HCA DATE] Found IV,0,0,0,,Date/Time: "${hcaDateTime}"`);

            // Extract the date part (before any space)
            const datePart = hcaDateTime.split(' ')[0].trim();
            console.log(`[HCA DATE] Extracted date part: "${datePart}"`);

            // Parse DD.MM.YYYY format
            const dotMatch = datePart.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
            if (dotMatch) {
                const [_, day, month, year] = dotMatch;
                const result = `${year}-${month}-${day}`;
                console.log(`[HCA DATE SUCCESS] Using date from IV,0,0,0,,Date/Time: ${result}`);
                return result;
            }
        }
        console.log(`[HCA DATE] No valid date in IV,0,0,0,,Date/Time, falling back to filename`);
    }



    // Try different date field names from CSV content
    const dateFields = [
        record['Actual Date'],
        record['IV,0,0,0,,Date/Time'],
        record['Raw Date']
    ];

    // 🔍 DEBUG: Log what fields exist
    console.log(`[DATE FIELDS] Actual Date: "${record['Actual Date']}", DateTime: "${record['IV,0,0,0,,Date/Time']}", Raw Date: "${record['Raw Date']}"`);

    for (const dateStr of dateFields) {
        if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') continue;

        // Extract just the date portion (before any space/time component)
        // Handles formats like "01.02.26 10:10:46 Day of Week..." from smoke detectors
        const datePart = dateStr.split(' ')[0].trim();

        console.log(`[DATE TRY CSV] Attempting to parse: "${datePart}" (from "${dateStr.substring(0, 30)}...")`);

        // Match DD.MM.YYYY format (4-digit year)
        const dotMatch = datePart.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        if (dotMatch) {
            const [_, day, month, year] = dotMatch;
            const result = `${year}-${month}-${day}`;
            console.log(`[DATE SUCCESS CSV] Extracted from CSV field (4-digit year): ${result}`);
            return result; // Convert to YYYY-MM-DD
        }

        // Match DD.MM.YY format (2-digit year) - NEW for Maienweg customer
        // Handles dates like "01.02.26" from HAG smoke detectors
        const dotMatch2 = datePart.match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
        if (dotMatch2) {
            const [_, day, month, yearShort] = dotMatch2;
            // Convert 2-digit year: ≤50 becomes 20xx, >50 becomes 19xx
            const yearNum = parseInt(yearShort, 10);
            const year = yearNum <= 50 ? `20${yearShort}` : `19${yearShort}`;
            const result = `${year}-${month}-${day}`;
            console.log(`[DATE SUCCESS CSV] Extracted from CSV field (2-digit year ${yearShort} → ${year}): ${result}`);
            return result; // Convert to YYYY-MM-DD
        }

        // Match DD-MM-YYYY format
        const dashMatch = datePart.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (dashMatch) {
            const [_, day, month, year] = dashMatch;
            const result = `${year}-${month}-${day}`;
            console.log(`[DATE SUCCESS CSV] Extracted from CSV field: ${result}`);
            return result; // Convert to YYYY-MM-DD
        }

    }

    // FALLBACK: If no date found in CSV content, try extracting from filename
    console.log(`[DATE FALLBACK] No CSV date found, trying filename: "${fileName}"`);
    if (fileName) {
        const filenameDate = extractDateFromFilename(fileName);
        console.log(`[DATE FILENAME RESULT] extractDateFromFilename returned: ${filenameDate}`);
        if (filenameDate) {
            console.log(`[DATE SUCCESS FILENAME] Using filename date for device ${deviceId}: ${filenameDate}`);
            return filenameDate;
        } else {
            console.error(`[DATE FAIL FILENAME] extractDateFromFilename returned null for: "${fileName}"`);
        }
    } else {
        console.error(`[DATE FAIL] No filename provided, cannot extract date!`);
    }

    console.error(`[DATE FAIL FINAL] No date found for device ${deviceId} (${deviceType})`);
    return null; // No valid date found
}