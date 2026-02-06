import { WirelessMbusParser } from "wireless-mbus-parser";
import databaseService from '../services/databaseService.js';

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

  async handleTelegramData(gatewayEui, telegram) {
    const telegramBuffer = Buffer.from(telegram, 'hex');
    const parser = new WirelessMbusParser();
    
    try {
      // First try with original buffer
      const result = await parser.parse(telegramBuffer, {
        containsCrc: undefined,
        key: Buffer.from(this.key, "hex")     
      });
      return await this.processParsedResult(gatewayEui, telegram, result);
    } catch (error) {
      if (error.message.includes('too short')|| 
      error.message.includes('DIF extension')) {
        console.warn({ gatewayEui, length: telegramBuffer.length }, 'Short telegram, trying padded version');
        
        // Pad and retry
        const paddedBuffer = Buffer.alloc(169);
        telegramBuffer.copy(paddedBuffer);
        
        const result = await parser.parse(paddedBuffer, {
          containsCrc: false,
          key: Buffer.from(this.key, "hex")     
        });
        return await this.processParsedResult(gatewayEui, telegram, result);
      }
      console.error({ gatewayEui, error: error.message }, 'Parse error');
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

    // === Validation for meter metadata ===
    if (typeof meterId !== 'string' || meterId.trim() === '') {
      console.warn({ gatewayEui }, 'Invalid or missing meter ID');
      return null;
    };

    try{
      const meter = await this.getLocalMeter(meterId);
      if(!meter) {
        console.warn({ gatewayEui, meterId }, 'Unknown meter ID, skipping');
        return null;
      }

      const frame_type = null;
      const encryption = null;

      if (typeof meterManufacturer !== 'string' || meterManufacturer.trim() === '') {
        console.warn({ gatewayEui, meterId }, 'Invalid or missing meter manufacturer');
        return null;
      }

      if (typeof meterDeviceType !== 'string' || meterDeviceType.trim() === '') {
        console.warn({ gatewayEui, meterId }, 'Invalid or missing device type');
        return null;
      }

      if (typeof version !== 'number' && typeof version !== 'string') {
        console.warn({ gatewayEui, meterId }, 'Invalid version format');
        return null;
      }

      if (status === undefined || status === null) {
        console.warn({ gatewayEui, meterId }, 'Missing status field');
        return null;
      }

      if (typeof accessNo !== 'number' || accessNo < 0 || !Number.isInteger(accessNo)) {
        console.warn({ gatewayEui, meterId }, 'Invalid access number');
        return null;
      }

      const readings = result.data;
      if (!readings || (Array.isArray(readings) ? readings.length === 0 : (typeof readings !== 'object' || Object.keys(readings).length === 0))) {
        console.warn({ gatewayEui, meterId }, 'Invalid or empty readings, skipping');
        return null;
      }

      // Deduplication - Prevent duplicate readings (same meter + timestamp)
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
        meterId,
        error: error.message
      }, 'Error processing telegram data');
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