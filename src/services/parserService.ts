import { ParserResult, WirelessMbusParser } from "wireless-mbus-parser";


export const handleTelegramData = async (gatewayEui: string, telegramBuffer: Buffer<ArrayBuffer>) => { 
  try {
    console.log('[handleTelegramData] Starting parse for gateway:', gatewayEui);
    console.log('[handleTelegramData] Telegram buffer type:', Object.prototype.toString.call(telegramBuffer));
    console.log('[handleTelegramData] Is Buffer:', Buffer.isBuffer(telegramBuffer));
    console.log('[handleTelegramData] Telegram buffer length:', telegramBuffer.length);
    console.log('[handleTelegramData] First 20 bytes:', Array.from(telegramBuffer.slice(0, 20)));
    
    // Basic validation
    if (telegramBuffer.length < 16) {
      throw new Error(`Telegram too short: ${telegramBuffer.length} bytes (minimum 16 required)`);
    }

    const comstarKey = process.env.COMSTAR_ENCRYPTION_KEY;

    if (!comstarKey) {
      console.error('[handleTelegramData] Comstar Encryption Key not found');
      throw new Error('Comstar Encryption Key not found')
    }

    console.log('[handleTelegramData] Using encryption key:', comstarKey.substring(0, 8) + '...');

    const parser = new WirelessMbusParser();    
    console.log('[handleTelegramData] About to parse telegram...');
    const result = await parser.parse(telegramBuffer, {
      key: Buffer.from(comstarKey, 'hex')
    });
    console.log('[handleTelegramData] Parse succeeded');
    console.log('[handleTelegramData] Parse result:', JSON.stringify(result, null, 2));

    // Decrypt independently to extract Engelmann-specific volume encoding
    // The parser misreads DIF=0x05 as a 32-bit float — we read it correctly here
    const EFE = 0x14C5;
    // if (manufacturer !== EFE) {
    //   console.log('[handleTelegramData] Non-EFE manufacturer, using standard processing');
    //   return await processParsedResult(result);
    // }
    // else {
      console.log('[handleTelegramData] EFE manufacturer detected, extracting Engelmann volume');
      const engelmannVolume = extractEngelmannVolume(telegramBuffer, comstarKey);
      console.log('[handleTelegramData] Engelmann Volume:', engelmannVolume);
      return await processParsedResult(result, engelmannVolume ?? undefined);
    // }

  } catch (error:any) {
    console.error('[handleTelegramData] Error:', error.message);
    console.error('[handleTelegramData] Error stack:', error.stack);
    throw new Error(error.message)
  }
}

const processParsedResult = (result: ParserResult, engelmannVolume?:number) => {
  try {
    const readings = result.data;
    const meterId = result.meter.id;
    const meterManufacturer = result.meter.manufacturer;
    const meterType = result.meter.type;
    const meterDeviceType = result.meter.deviceType;
    const version = result.meter.version;
    const status = result.meter.status;
    const accessNo = result.meter.accessNo;


    const transformedReadings = transformMbusToWebFormat(
      readings,
      engelmannVolume  // <-- pass through the corrected volume
    );
    return transformedReadings;
  } catch (error) {
    
  }
}

const extractEngelmannVolume = (telegramBuffer: Buffer<ArrayBuffer>, comstarKey: string) => {
  try {
    const crypto = require('crypto');
    const key = Buffer.from(comstarKey, 'hex');
    const acc = telegramBuffer[12]; // ELL ACC field
    const iv = Buffer.from([
      telegramBuffer[2], telegramBuffer[3],
      telegramBuffer[4], telegramBuffer[5],
      telegramBuffer[6], telegramBuffer[7],
      telegramBuffer[8], telegramBuffer[9],
      acc, acc, acc, acc, acc, acc, acc, acc
    ]);

    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    decipher.setAutoPadding(false);
    const dec = Buffer.concat([
      decipher.update(telegramBuffer.slice(18)),
      decipher.final()
    ]);

    // Verify AES
    if (dec[0] !== 0x2F || dec[1] !== 0x2F) return null;

    // Check for Engelmann's non-standard DIF=0x05 VIF=0x12 volume record
    if (dec[8] === 0x05 && dec[9] === 0x12) {
      const rawByte = dec[10]; // e.g. 0x32 = 50
      return rawByte * 0.001;  // -> 0.050 m³
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Transform M-Bus readings array to web-compatible flat object format
 * This ensures parsed_data matches the format expected by the web project's parser
 * 
 * @param {Array} readings - Raw M-Bus readings array from wireless-mbus-parser
 * @param {string} meterId - Meter device ID
 * @param {string} meterManufacturer - Meter manufacturer
 * @param {string} meterDeviceType - Device type (Heat, Water, etc.)
 * @param {number|string} version - Meter version
 * @param {number|string} status - Meter status
 * @param {number} accessNo - Access number
 * @param {string|null} frameType - Frame type
 * @returns {Object} Transformed readings in flat object format
 */


function transformMbusToWebFormat(readings:any, engelmannVolume?:number) {
  const result: { [key: string]: any } = {};

  const columnMap: { [key: string]: string } = {
    'Time point': 'IV,0,0,0,,Date/Time',
    'Energy': 'IV,0,0,0,Wh,E',
    'Volume': 'IV,0,0,0,m^3,Vol',
    'Units HCA': 'IV,0,0,0,,Units HCA',
    'Date': 'IV,1,0,0,,Date',
    'Energy 1': 'IV,1,0,0,Wh,E',
    'Volume 1': 'IV,1,0,0,m^3,Vol',
    'Units HCA 1': 'IV,1,0,0,,Units HCA',
    'ErrorFlags': 'IV,0,0,0,,ErrorFlags(binary)(deviceType specific)',
    'Model/Version': 'IV,0,0,0,Model/Version',
    'Parameter set ident': 'IV,0,0,0,,Parameter set ident',
    'Volume; Accumulation of abs value only if negative contributions': 'IV,0,0,0,m^3,Vol',
  };

  if (Array.isArray(readings)) {
    readings.forEach((item:any) => {
      if (item && item.description) {
        const columnName = item.description in columnMap
          ? columnMap[item.description as keyof typeof columnMap]
          : item.description;
        const existing = result[columnName];
        if (existing !== undefined) {
          if (isSentinel(existing) && !isSentinel(item.value)) {
            result[columnName] = item.value;
          }
        } else {
          result[columnName] = isSentinel(item.value) ? null : item.value;
        }
      }
    });
  } else if (typeof readings === 'object' && readings !== null) {
    Object.entries(readings).forEach(([key, value]) => {
      const columnName = columnMap[key] || key;
      result[columnName] = isSentinel(value as number) ? null : value;
    });
  }

  // Apply Engelmann-specific volume override LAST — wins over parser garbage
  if (engelmannVolume !== null) {
    result['IV,0,0,0,m^3,Vol'] = engelmannVolume;
  }

  return result;
}

function isSentinel(value:number) {
  if (value === null || value === undefined) return true;
  if (Math.round(value * 1000) === 0xFFFFFFFF) return true;
  if (typeof value === 'number' && Math.abs(value) < 1e-10) return true; // float garbage
  return false;
}