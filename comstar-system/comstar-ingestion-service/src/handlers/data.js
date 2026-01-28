import { WirelessMbusParser } from "wireless-mbus-parser";
import databaseService from '../services/databaseService.js';

class DataHandler {
  constructor() {
    this.name = 'data';
    this.isUrgent = false;
    this.meterMapping = null;
    this.parser = null;
    this.key = "0102030405060708090A0B0C0D0E0F11";
  }

  async initialize() {
    // if (!this.meterMapping) {
    //   this.meterMapping = await databaseService.getMeterMapping();
    // }
  }

  async handle({ gatewayEui, data, messageNumber }) {
    if(data && data.d.telegram) {
      return this.handleTelegramData(gatewayEui, data.d.telegram);
    } else {
      console.warn({ gatewayEui, data }, 'No telegram data found');
      return null;
    }
  }

  async handleTelegramData(gatewayEui, telegram) {
    // console.log({ gatewayEui, telegram }, 'Processing telegram data');
    // Process telegram data here
    const parser = new WirelessMbusParser();
    const result = await parser.parse(
      Buffer.from(telegram, 'hex'),
      {
    // verbose: true,
    containsCrc: undefined,  
    key: Buffer.from(this.key, "hex")     
      }
    );

    console.log('Result========>', result)
    
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
    }

    const meter = await this.getLocalMeter(meterId);
    if(!meter) {
      console.warn({ gatewayEui, meterId }, 'Unknown meter ID, skipping');
      return null;
    }

    //Fields will come from Engelmann's pre-decoded CSV format - null for now
    const frame_type = null;
    const encryption = null;

    if (typeof meterManufacturer !== 'string' || meterManufacturer.trim() === '') {
      console.warn({ gatewayEui, meterId }, 'Invalid or missing meter manufacturer');
      return null;
    }

    // if (typeof meterType !== 'string' || meterType.trim() === '') {
    //   console.warn({ gatewayEui, meterId }, 'Invalid or missing meter type');
    //   return null;
    // }

    if (typeof meterDeviceType !== 'string' || meterDeviceType.trim() === '') {
      console.warn({ gatewayEui, meterId }, 'Invalid or missing device type');
      return null;
    }

    // Version is usually a number (0-255), but some parsers return string/hex
    if (typeof version !== 'number' && typeof version !== 'string') {
      console.warn({ gatewayEui, meterId }, 'Invalid version format');
      return null;
    }

    // Status can be a number, string, or object depending on parser
    // We'll accept anything non-null/undefined for now, but log if unexpected
    if (status === undefined || status === null) {
      console.warn({ gatewayEui, meterId }, 'Missing status field');
      return null;
    }

    // Access number should be a positive integer
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

    await databaseService.saveTelegramDetails(gatewayEui, BigInt(new Date("2008-05-31T21:50:00.000Z").getTime()).toString(), telegram, rssi, mode, frame_type, meterId, meterManufacturer, version, meterType)
    console.log('TELEGRAM WMBUS DATA SAVED✅')

    // const exists = await databaseService.checkExistingReading(meter.local_meter_id, timestamp);
    // if (exists) {
    //   console.log({ gatewayEui, meterId, timestamp }, 'Duplicate reading detected, skipping insertion');
    //   return null;
    // }
    //SAVE TO PARSED DATA
    // await databaseService.insertMeterReading(meterId, meterManufacturer, meterType, meterDeviceType, version, status, accessNo, readings, meter.local_meter_id, frame_type, encryption);

    return {
      success: true,
      gatewayEui,
      meterId,
      processedAt: new Date()
    };
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