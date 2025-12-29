import { WirelessMbusParser } from "wireless-mbus-parser";

class DataHandler {
  constructor() {
    this.name = 'data';
    this.isUrgent = false;
    this.meterMapping = null;
    this.parser = null;
  }

  async initialize() {
    if (!this.meterMapping) {
      this.meterMapping = await databaseService.getMeterMapping();
    }
  }

  async handle({ gatewayEui, data, messageNumber }) {
    console.log({ gatewayEui, messageNumber }, 'Processing data update');
    if(data && data.telegram) {
      return this.handleTelegramData(gatewayEui, data.telegram);
    } else {
      console.warn({ gatewayEui, data }, 'No telegram data found');
      return null;
    }
  }

  async handleTelegramData(gatewayEui, telegram) {
    console.log({ gatewayEui, telegram }, 'Handling telegram data');
    // Process telegram data here
    const parser = new WirelessMbusParser();
    const evaluatedData = await parser.parse(
      Buffer.from(telegram, "hex"),
      { key: Buffer.from("00112233445566778899AABBCCDDEEFF", "hex") }
    );
    console.log(evaluatedData, 'Telegram data parsed successfully');

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