import { decode } from 'cbor-x';

export function decodeSerial(payload: Buffer): string {
  try {
    const decoded = decode(payload);
    
    return JSON.stringify(decoded, (key, value) => {
      if (typeof value === 'bigint') return value.toString();
      if (Buffer.isBuffer(value)) return value.toString('hex'); // Show sub-buffers as hex
      return value;
    }, 2);

  } catch (e: any) {
    try {
      return JSON.stringify(JSON.parse(payload.toString()), null, 2);
    } catch {
      return payload.toString();
    }
  }
}