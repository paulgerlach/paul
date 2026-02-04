/**
 * Server-side error detection and webhook notification system
 * Detects critical errors (leak detected, pipe broken) from CSV data
 * and sends email notifications to property managers via webhooks
 */

import { interpretErrorFlags, ErrorInterpretation } from './errorFlagInterpreter';
import { sendLeakDetectedEvent } from './webhooks';
import type { MeterReadingType } from '@/api';

/**
 * Critical error types that trigger immediate notifications
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
 * Check if an error is critical and requires immediate notification
 */
function isCriticalError(errorInterpretation: ErrorInterpretation): boolean {
    return errorInterpretation.errors.some(error =>
        CRITICAL_ERROR_KEYWORDS.some(keyword =>
            error.toLowerCase().includes(keyword.toLowerCase())
        )
    );
}

/**
 * Interface for property manager lookup result
 */
interface PropertyManagerInfo {
    email: string;
    propertyAddress?: string;
    apartmentInfo?: string;
}

/**
 * Lookup property manager email from device ID
 * Follows the chain: device_id -> local_meters -> locals -> objekte -> users
 * 
 * @param deviceId - The meter device ID from CSV
 * @param supabase - Supabase client instance
 * @returns Property manager info or null if not found
 */
async function lookupPropertyManager(
    deviceId: string,
    supabase: any
): Promise<PropertyManagerInfo | null> {
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

        // Build apartment info string
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
 * Process CSV data and send webhook notifications for critical errors
 * This should be called during CSV processing on the server side
 * 
 * @param parsedData - Array of meter readings from CSV
 * @param supabase - Supabase client instance (server-side)
 */
export async function processErrorsAndNotify(
    parsedData: MeterReadingType[],
    supabase: any
): Promise<void> {
    console.log(`[WEBHOOK] Processing ${parsedData.length} records for error detection`);

    const notificationsSent: string[] = [];

    for (const device of parsedData) {
        // Interpret error flags
        const errorInterpretation = interpretErrorFlags(device);

        if (!errorInterpretation) {
            continue; // No errors detected
        }

        // Check if this is a critical error
        if (!isCriticalError(errorInterpretation)) {
            continue; // Not critical, skip notification
        }

        const deviceId = errorInterpretation.deviceId;

        // Prevent duplicate notifications for the same device in this batch
        if (notificationsSent.includes(deviceId)) {
            continue;
        }

        console.log(`[WEBHOOK] Critical error detected for device ${deviceId}:`, errorInterpretation.errors);

        // Lookup property manager
        const managerInfo = await lookupPropertyManager(deviceId, supabase);

        if (!managerInfo) {
            console.warn(`[WEBHOOK] Could not find property manager for device ${deviceId}, skipping notification`);
            continue;
        }

        // Send webhook notification
        try {
            await sendLeakDetectedEvent(
                managerInfo.email,
                deviceId,
                errorInterpretation.deviceType,
                errorInterpretation.errors.join(', '),
                managerInfo.propertyAddress,
                managerInfo.apartmentInfo
            );

            notificationsSent.push(deviceId);
            console.log(`[WEBHOOK] Notification sent to ${managerInfo.email} for device ${deviceId}`);
        } catch (error) {
            console.error(`[WEBHOOK] Failed to send notification for device ${deviceId}:`, error);
        }
    }

    console.log(`[WEBHOOK] Sent ${notificationsSent.length} critical error notifications`);
}

/**
 * Detect errors from CSV data (client-side compatible version)
 * Returns list of critical errors without sending notifications
 * This mirrors the server-side detection logic for consistency
 * 
 * @param parsedData - Array of meter readings from CSV
 * @returns Array of critical error interpretations
 */
export function detectCriticalErrors(
    parsedData: MeterReadingType[]
): ErrorInterpretation[] {
    const criticalErrors: ErrorInterpretation[] = [];

    for (const device of parsedData) {
        const errorInterpretation = interpretErrorFlags(device);

        if (errorInterpretation && isCriticalError(errorInterpretation)) {
            criticalErrors.push(errorInterpretation);
        }
    }

    return criticalErrors;
}
