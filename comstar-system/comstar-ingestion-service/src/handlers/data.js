import { WirelessMbusParser } from "wireless-mbus-parser";
import databaseService from '../services/databaseService.js';
import logger from '../utils/logger.js';

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
function transformMbusToWebFormat(readings, meterId, meterManufacturer, meterDeviceType, version, status, accessNo, frameType) {
  const result = {};
  
  // Map M-Bus descriptions to web format column names
  const columnMap = {
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
  };
  
  // Transform array to flat object
  if (Array.isArray(readings)) {
    readings.forEach(item => {
      console.log('Processing reading item======>:', item);
      if (item && item.description) {
        const columnName = columnMap[item.description] || item.description;
        result[columnName] = item.value;
      }
    });
  } else if (typeof readings === 'object' && readings !== null) {
    // Handle case where readings is already an object
    Object.entries(readings).forEach(([key, value]) => {
      const columnName = columnMap[key] || key;
      result[columnName] = value;
    });
  }
  
  // Add metadata fields to parsed_data for web compatibility
  // These fields are expected by the web project's transformation logic
  result['Frame Type'] = frameType || 'SND_NR';
  result['Manufacturer'] = meterManufacturer;
  result['ID'] = String(meterId);
  result['Version'] = version;
  result['Device Type'] = meterDeviceType;
  result['Access Number'] = accessNo;
  result['Status'] = status;
  result['Encryption'] = 0;
  result['TPL-Config'] = '';
  
  return result;
}

class DataHandler {
  constructor() {
    this.name = 'data';
    this.isUrgent = false;
    this.meterMapping = null;
    this.parser = null;
    this.key = process.env.COMSTAR_ENCRYPTION_KEY;
  }

  async initialize() {
    // if (!this.meterMapping) {
    //   this.meterMapping = await databaseService.getMeterMapping();
    // }
  }

  async handle({ gatewayEui, data, messageNumber }) {
    if (data && data.batch && Array.isArray(data.batch)) {
    // Handle batch of telegrams
    for (const item of data.batch) {
      if (item.telegram) {
        await this.handleTelegramData(gatewayEui, item.telegram);
      }
    }
    } else if(data && data.d.telegram) {
        return this.handleTelegramData(gatewayEui, data.d.telegram);
    } else {
      console.warn({ gatewayEui, data }, 'No telegram data found');
      return null;
    }
  }
  validateTelegram(buffer) {
  if (buffer.length < 10) {
    return { valid: false, reason: 'Too short (minimum 10 bytes)' };
  }
  
  const lengthByte = buffer[0];
  const actualLength = buffer.length;
  
  // Length byte indicates payload length (excluding length byte itself)
  if (lengthByte !== actualLength - 1) {
    return { 
      valid: false, 
      reason: `Length mismatch: declared=${lengthByte}, actual=${actualLength - 1}` 
    };
  }
  
  return { valid: true };
}

  async handleTelegramData(gatewayEui, telegram) {
    const telegramBuffer = Buffer.from(telegram, 'hex');
     
  // Validate first
  const validation = validateTelegram(telegramBuffer);
  if (!validation.valid) {
    console.warn({ gatewayEui, reason: validation.reason }, 'Invalid telegram');
    return null;
  }
    const parser = new WirelessMbusParser();
    
    try {
    const result = await parser.parse(telegramBuffer, {
      key: Buffer.from(this.key, "hex")
    });
      return await this.processParsedResult(gatewayEui, telegram, result);
    } catch (error) {
      if (!error.message.includes('Wrong key')) {
        console.error({
          gatewayEui,
          error: error.message,
          telegramLength: telegramBuffer.length
        }, 'Parse error');
      }
      
      return null;
    }
  }

  async processParsedResult(gatewayEui, telegram, result) {
  
  const meterId = result.meter.id;
  const meterManufacturer = result.meter.manufacturer;
  const meterType = result.meter.type;
  const meterDeviceType = result.meter.deviceType;
  const version = result.meter.version;
  const status = result.meter.status;
  const accessNo = result.meter.accessNo;
  const rssi = result.meter.rssi;
  const mode = result.meter.mode;
  // Extract these from result if available, otherwise use null
  const frame_type = result.frame_type ?? null;
  const encryption = result.encryption ?? null;

  // Validation for meter metadata
  if (typeof meterId !== 'string' || meterId.trim() === '') {
    console.warn({ gatewayEui }, 'Invalid or missing meter ID');
    return null;
  }
  
  try {
    await databaseService.saveTelegramDetails(gatewayEui, BigInt(new Date()).toString(), telegram, rssi, mode, frame_type, meterId, meterManufacturer, version, meterType);
    
    const meter = await this.getLocalMeter(meterId);
    // if (!meter) {
    //   console.warn({ gatewayEui, meterId }, 'Unknown meter ID, skipping');
    //   return null;
    // }

    // ... rest of validations ...

    const readings = result.data;
    if (!readings || (Array.isArray(readings) ? readings.length === 0 : (typeof readings !== 'object' || Object.keys(readings).length === 0))) {
      console.warn({ gatewayEui, meterId }, 'Invalid or empty readings, skipping');
      return null;
    }

    // Get timestamp
    let timestamp;
    if (Array.isArray(readings)) {
      const timePoint = readings.find(item => item.description === 'Time point');
      timestamp = timePoint ? timePoint.value : null;
    } else {
      timestamp = readings.date;
    }
    
    if (!timestamp) {
      console.warn({ gatewayEui, meterId }, 'No timestamp in readings, skipping');
      return null;
    }

    if (meter) {
      const exists = await databaseService.checkExistingReading(meter.id, timestamp);
      if (exists) {
        console.log({ gatewayEui, meterId, timestamp }, 'Duplicate reading detected, skipping insertion');
        return null;
      }
    }

    // Transform readings to web-compatible format before storing
    const transformedReadings = transformMbusToWebFormat(
      readings,
      meterId,
      meterManufacturer,
      meterDeviceType,
      version,
      status,
      accessNo,
      frame_type
    );

    await databaseService.insertMeterReading(meterId, meterManufacturer, meterType, meterDeviceType, version, status, accessNo, transformedReadings, meter ? meter.id : null, frame_type, encryption);

    return {
      success: true,
      gatewayEui,
      meterId,
      processedAt: new Date()
    };
  } catch (error) {
    logger.error({
      gatewayEui,
      meterId,  // ✅ Fixed
      error: error.message,
      stack: error.stack
    }, 'Error processing telegram data');
    return null;  // ✅ Explicit return
  }
}

async handleTelegramData(gatewayEui, telegram) {
  const telegramBuffer = Buffer.from(telegram, 'hex');
  const parser = new WirelessMbusParser();
  
  try {
    // Try with original buffer
    const result = await parser.parse(telegramBuffer, {
      containsCrc: undefined,
      key: Buffer.from(this.key, "hex")     
    });
    return await this.processParsedResult(gatewayEui, telegram, result);
  } catch (error) {
    if (error.message.includes('too short') || error.message.includes('DIF extension')) {
      console.warn({ 
        gatewayEui, 
        length: telegramBuffer.length,
        errorMsg: error.message 
      }, 'Parse error, attempting recovery');
      
      try {
        // Only pad if telegram is genuinely short
        if (telegramBuffer.length < 169) {
          const paddedBuffer = Buffer.alloc(169);
          telegramBuffer.copy(paddedBuffer);
          
          const result = await parser.parse(paddedBuffer, {
            containsCrc: false,
            key: Buffer.from(this.key, "hex")     
          });
          return await this.processParsedResult(gatewayEui, telegram, result);
        }
      } catch (paddingError) {
        console.error({ 
          gatewayEui, 
          error: paddingError.message 
        }, 'Padded parse also failed');
        return null;
      }
    }
    
    console.error({ 
      gatewayEui, 
      error: error.message,
      telegramLength: telegramBuffer.length
    }, 'Unrecoverable parse error');
    return null;
  }
}

  async getLocalMeter(meterId) {
    try {
      const meter = await databaseService.getLocalMeterById(meterId);
      return meter;
    }
    catch (error) {
      throw error;
    }
  }
}

const dataHandler = new DataHandler();
export default dataHandler;