import { WirelessMbusParser } from "wireless-mbus-parser";

class DataHandler {
  constructor() {
    this.name = 'data';
    this.isUrgent = false;
    this.meterMapping = null;
    this.parser = null;
    this.key = "0102030405060708090A0B0C0D0E0F11";
  }

  async initialize() {
    if (!this.meterMapping) {
      this.meterMapping = await databaseService.getMeterMapping();
    }
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
    
    console.log(result, 'Telegram data parsed successfully');

    // For example, parse the telegram and store relevant information
    return {
      success: true,
      gatewayEui,
      processedAt: new Date()
    };
  }

}

const dataHandler = new DataHandler();
export default dataHandler;