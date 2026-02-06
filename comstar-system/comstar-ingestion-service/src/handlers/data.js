import { WirelessMbusParser } from "wireless-mbus-parser";
import databaseService from '../services/databaseService.js';
import logger from '../utils/logger.js';

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
    console.log('PARSED USAGE DATA =====>>', data);
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
      console.error({
        gatewayEui,
        error: error.message,
        telegramLength: telegramBuffer.length
      }, 'Parse error');
      
      return null;
    }
  }

  async processParsedResult(gatewayEui, telegram, result) {
  console.log("RESULT OF PROCESSING====>", result);
  
  const meterId = result.meter.id;
  const meterManufacturer = result.meter.manufacturer;
  const meterType = result.meter.type;
  const meterDeviceType = result.meter.deviceType;
  const version = result.meter.version;
  const status = result.meter.status;
  const accessNo = result.meter.accessNo;
  const rssi = result.meter.rssi;
  const mode = result.meter.mode;

  // Validation for meter metadata
  if (typeof meterId !== 'string' || meterId.trim() === '') {
    console.warn({ gatewayEui }, 'Invalid or missing meter ID');
    return null;
  }
  
  try {
    const meter = await this.getLocalMeter(meterId);
    if (!meter) {
      console.warn({ gatewayEui, meterId }, 'Unknown meter ID, skipping');
      return null;
    }

    // Extract these from result if available, otherwise use null
    const frame_type = result.frame_type ?? null;
    const encryption = result.encryption ?? null;

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

    await databaseService.saveTelegramDetails(gatewayEui, BigInt(new Date()).toString(), telegram, rssi, mode, frame_type, meterId, meterManufacturer, version, meterType);
    console.log('Telegram saved');

    const exists = await databaseService.checkExistingReading(meter.id, timestamp);
    if (exists) {
      console.log({ gatewayEui, meterId, timestamp }, 'Duplicate reading detected, skipping insertion');
      return null;
    }

    await databaseService.insertMeterReading(meterId, meterManufacturer, meterType, meterDeviceType, version, status, accessNo, readings, meter.id, frame_type, encryption);

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
      console.error(error)
      throw error;
    }
  }
}

const dataHandler = new DataHandler();
export default dataHandler;