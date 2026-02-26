import { WirelessMbusParser } from "wireless-mbus-parser";


const handleTelegramData = async (gatewayEui: string, telegram: string) => { 
  try {
    const telegramBuffer = Buffer.from(telegram, 'hex');
    // Filter non-EFE manufacturers silently
    const manufacturer = telegramBuffer.readUInt16LE(2);

    const parser = new WirelessMbusParser();
    const comstarKey = process.env.COMSTAR_ENCRYPTION_KEY;

    if (!comstarKey)
      throw new Error('Comstar Encryption Key not found')
    
    
    const result = await parser.parse(telegramBuffer, {
      key: Buffer.from(comstarKey, 'hex')
    });

  } catch (error:any) {
    console.error(error.message);
    throw new Error(error.message)
  }
}