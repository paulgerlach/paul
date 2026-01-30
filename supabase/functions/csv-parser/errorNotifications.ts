/**
 * Error notification and webhook integration for CSV parser
 * Detects critical errors and sends notifications to property managers
 */

import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Webhook configuration
 */
const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/66fhqggqew5ngf5p1bx4qobr88qjlj2q';

/**
 * Critical error keywords that trigger notifications
 */
const CRITICAL_ERROR_KEYWORDS = [
    'Leckage erkannt',        // Leak detected
    'Leckage',                // Leakage
    'Rohrbruch',              // Pipe broken
    'Kabelbruch',             // Cable break
    'Elektronik defekt',      // Electronics defect
    'Kurzschluss',            // Short circuit
    'Sensorfehler'            // Sensor error
];

/**
 * Error flag mappings (simplified version from errorFlagInterpreter.ts)
 */
const MANUFACTURER_ERROR_MAPPINGS: Record<string, Record<number, string>> = {
    EFE: {
        0: "Temperatursensor Kabelbruch",
        1: "Temperatursensor Kurzschluss",
        2: "Temperatursensor 2 Kabelbruch",
        3: "Temperatursensor 2 Kurzschluss",
        4: "Durchflussmesssystem Fehler",
        5: "Elektronik defekt",
        6: "Gerät Reset",
        7: "Schwache Batterie"
    },
    DWZ: {
        0: "Sensorfehler",
        1: "Gerät Reset",
        2: "Software-Fehler",
        3: "Manipulationserkennung",
        4: "Batteriespannungsfehler",
        5: "Rückfluss oder Blockade",
        6: "Leckage erkannt",
        7: "Überlasthinweis"
    }
};

interface ParsedRecord {
    [key: string]: string | number;
}

/**
 * Parse binary error flag
 */
function parseBinaryFlag(flagString: string | number): number {
    if (!flagString || flagString === "0b") return 0;
    const flagStr = typeof flagString === "string" ? flagString : String(flagString);
    const cleanFlag = flagStr.replace(/^0?b/, '');
    if (cleanFlag === '') return 0;
    try {
        return parseInt(cleanFlag, 2);
    } catch {
        return parseInt(cleanFlag, 10) || 0;
    }
}

/**
 * Interpret error flags from a device record
 */
function interpretErrorFlags(device: ParsedRecord): { deviceId: string; deviceType: string; errors: string[] } | null {
    const errorFlagRaw = device["IV,0,0,0,,ErrorFlags(binary)(deviceType specific)"];

    if (!errorFlagRaw || errorFlagRaw === "0b" || errorFlagRaw === 0) {
        return null;
    }

    const errorFlag = parseBinaryFlag(errorFlagRaw as string | number);
    if (errorFlag === 0) return null;

    const deviceType = device["Device Type"]?.toString() || '';
    const manufacturer = device.Manufacturer?.toString() || '';
    const deviceId = (device.ID || device["Number Meter"])?.toString() || '';

    const errors: string[] = [];
    const mapping = MANUFACTURER_ERROR_MAPPINGS[manufacturer];

    for (let bit = 0; bit < 8; bit++) {
        if (errorFlag & (1 << bit)) {
            const errorMessage = mapping?.[bit] || `Gerätefehler Bit ${bit}`;
            errors.push(errorMessage);
        }
    }

    if (errors.length === 0) return null;

    return { deviceId, deviceType, errors };
}

/**
 * Check if error is critical
 */
function isCriticalError(errors: string[]): boolean {
    return errors.some(error =>
        CRITICAL_ERROR_KEYWORDS.some(keyword =>
            error.toLowerCase().includes(keyword.toLowerCase())
        )
    );
}

/**
 * Send webhook notification
 */
async function sendWebhook(
    email: string,
    deviceId: string,
    deviceType: string,
    errorDescription: string,
    propertyAddress?: string,
    apartmentInfo?: string
): Promise<void> {
    // Validate required fields to prevent empty notifications
    if (!email || !deviceId || !errorDescription) {
        console.warn('[WEBHOOK] Skipping notification - missing required fields:', { email: !!email, deviceId: !!deviceId, errorDescription: !!errorDescription });
        return;
    }

    try {
        const payload = {
            event_type: 'leakdetected',
            email,
            timestamp: new Date().toISOString(),
            device_id: deviceId,
            device_type: deviceType,
            error_description: errorDescription,
            property_address: propertyAddress,
            apartment_info: apartmentInfo,
            severity: 'critical'
        };

        console.log(`[WEBHOOK] Sending leak notification to ${email} for device ${deviceId}`);

        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`[WEBHOOK] Failed to send notification: ${response.statusText}`);
        } else {
            console.log(`[WEBHOOK] Successfully sent notification`);
        }
    } catch (error) {
        console.error(`[WEBHOOK] Error sending notification:`, error);
    }
}

/**
 * Lookup property manager email from device ID
 */
async function lookupPropertyManager(
    deviceId: string,
    supabase: SupabaseClient
): Promise<{ email: string; propertyAddress?: string; apartmentInfo?: string } | null> {
    try {
        // Step 1: Find local_meter by device_id (meter_number)
        const { data: localMeter, error: meterError } = await supabase
            .from('local_meters')
            .select('local_id, meter_number')
            .eq('meter_number', deviceId)
            .single();

        if (meterError || !localMeter) {
            console.log(`[WEBHOOK] No local_meter found for device ${deviceId}`);
            return null;
        }

        // Step 2: Get local (apartment) info
        const { data: local, error: localError } = await supabase
            .from('locals')
            .select('objekt_id, usage_type, floor, house_location')
            .eq('id', localMeter.local_id)
            .single();

        if (localError || !local) {
            console.log(`[WEBHOOK] No local found for local_id ${localMeter.local_id}`);
            return null;
        }

        // Step 3: Get objekt (property) info
        const { data: objekt, error: objektError } = await supabase
            .from('objekte')
            .select('user_id, street, zip')
            .eq('id', local.objekt_id)
            .single();

        if (objektError || !objekt) {
            console.log(`[WEBHOOK] No objekt found for objekt_id ${local.objekt_id}`);
            return null;
        }

        // Step 4: Get user (property manager) email
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('email, first_name, last_name')
            .eq('id', objekt.user_id)
            .single();

        if (userError || !user) {
            console.log(`[WEBHOOK] No user found for user_id ${objekt.user_id}`);
            return null;
        }

        const apartmentInfo = [
            local.usage_type,
            local.floor ? `${local.floor}. OG` : null,
            local.house_location
        ].filter(Boolean).join(', ');

        return {
            email: user.email,
            propertyAddress: `${objekt.street}, ${objekt.zip}`,
            apartmentInfo: apartmentInfo || undefined
        };
    } catch (error) {
        console.error('[WEBHOOK] Error looking up property manager:', error);
        return null;
    }
}

/**
 * Process errors and send notifications
 * Call this after CSV data has been inserted into the database
 */
export async function processErrorsAndNotify(
    parsedData: ParsedRecord[],
    supabase: SupabaseClient
): Promise<void> {
    console.log(`[WEBHOOK] Processing ${parsedData.length} records for error detection`);

    const notificationsSent: string[] = [];

    for (const device of parsedData) {
        const errorInterpretation = interpretErrorFlags(device);
        if (!errorInterpretation) continue;

        if (!isCriticalError(errorInterpretation.errors)) continue;

        const deviceId = errorInterpretation.deviceId;
        if (notificationsSent.includes(deviceId)) continue;

        console.log(`[WEBHOOK] Critical error detected for device ${deviceId}:`, errorInterpretation.errors);

        const managerInfo = await lookupPropertyManager(deviceId, supabase);

        // Use fallback values for testing when no manager is found
        const notificationEmail = managerInfo?.email || 'info@heidisystems.com';
        const propertyAddress = managerInfo?.propertyAddress || 'NO PROPERTY MANAGER - Meter not linked';
        const apartmentInfo = managerInfo?.apartmentInfo || 'Unlinked Meter';

        if (!managerInfo) {
            console.warn(`[WEBHOOK] Could not find property manager for device ${deviceId}, using fallback email: info@heidisystems.com`);
        }

        try {
            await sendWebhook(
                notificationEmail,
                deviceId,
                errorInterpretation.deviceType,
                errorInterpretation.errors.join(', '),
                propertyAddress,
                apartmentInfo
            );
            notificationsSent.push(deviceId);
            console.log(`[WEBHOOK] Notification sent to ${notificationEmail} for device ${deviceId}`);
        } catch (error) {
            console.error(`[WEBHOOK] Failed to send notification for device ${deviceId}:`, error);
        }
    }

    console.log(`[WEBHOOK] Sent ${notificationsSent.length} critical error notifications`);
}
