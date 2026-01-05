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
    console.log({ gatewayEui, messageNumber }, 'Processing data update');
    if(data && data.d.telegram) {
      return this.handleTelegramData(gatewayEui, data.d.telegram);
    } else {
      console.warn({ gatewayEui, data }, 'No telegram data found');
      return null;
    }
  }

  async handleTelegramData(gatewayEui, telegram) {
    console.log({ gatewayEui, telegram }, 'Processing telegram data');
    // Process telegram data here
    const parser = new WirelessMbusParser();
    const result = await parser.parse(
      Buffer.from(telegram, 'hex'),
      {
    // verbose: true,
    containsCrc: undefined,  
    key: Buffer.from(this.key, "hex")     
      }
      // { key: Buffer.from(process.env.DEFAULT_KEY_EFE ?? '', "hex") }
    );
    
    const meterId = result.meter.id;
    const meterManufacturer = result.meter.manufacturer;
    const meterType = result.meter.type;
    const meterDeviceType = result.meter.deviceType;
    const version = result.meter.version;
    const status = result.meter.status;
    const accessNo = result.meter.accessNo;

    const readings = result.data;

    await databaseService.insertMeterReading(meterId, meterManufacturer, meterType, meterDeviceType, version, status, accessNo, readings);

    return {
      success: true,
      gatewayEui,
      meterId,
      processedAt: new Date()
    };
  }

}

const dataHandler = new DataHandler();
export default dataHandler;