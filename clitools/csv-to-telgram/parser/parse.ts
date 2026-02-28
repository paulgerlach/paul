import { WirelessMbusParser } from 'wireless-mbus-parser';
import { type TelegramData } from './types';

export function byteArrayToHexString(byteArray: Uint8Array): string {
    return Array.from(byteArray, function (byte: number) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

export async function parseTelegram(telegram: Uint8Array, key: string, verbose: boolean): Promise<TelegramData> {
    const parser = new WirelessMbusParser();
    const data = await parser.parse(Buffer.from(telegram), {
        key: Buffer.from(key, 'hex'),
        containsCrc: false,
        verbose: true,
    });

    if (verbose) console.log(data);

    const result: TelegramData = {
        device_id: data.meter.id,
        manufacturer: data.meter.manufacturer,
        device_type: data.meter.deviceType,
        src_data: '',
        status: data.meter.status,
        version: data.meter.version,
    };

    // self referential bullshit
    result.src_data = JSON.stringify(result);

    return result;
}