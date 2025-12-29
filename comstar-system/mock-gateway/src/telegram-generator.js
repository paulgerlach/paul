import { randomUUID } from 'crypto';

export class TelegramGenerator { 
  constructor(config) { 
    this.config = config;
    this.manufacturers = ['EFE', 'HAG', 'KAM', 'SON', 'SEN'];
    this.deviceTypes = {
      'EFE': ['07', '08'],  // Heat meters, Heat cost allocators
      'HAG': ['02', '0A'],  // Water meters
      'KAM': ['02', '03'],  // Electricity meters
      'SON': ['03', '07'],  // Various
      'SEN': ['0A', '0B']   // Water, Gas
    };

    this.mockMeters = this.generateMockMeters();
  }

  generateMockMeters() {
    const meters = [];
    const serials = ['12345678', '87654321', '11223344', '44332211', '55667788'];
    
    serials.forEach(serial => {
      console.log('MANU', this.manufacturers);
      console.log('DEVICE TYPES', this.deviceTypes);
      const manufacturer = this.manufacturers[Math.floor(Math.random() * this.manufacturers.length)];
      const type = this.deviceTypes[manufacturer][Math.floor(Math.random() * this.deviceTypes[manufacturer].length)];
      
      meters.push({
        serial,
        manufacturer,
        type,
        version: '01',
        initialValue: Math.random() * 10000,
        unit: this.getUnitForType(type),
        incrementPerDay: 1 + Math.random() * 10
      });
    });
    
    return meters;
  }

  getUnitForType(type) {
    const unitMap = {
      '02': 'kWh', // Electricity
      '03': 'kWh', // Electricity
      '07': 'kWh', // Heat
      '08': 'kWh', // Heat cost allocator
      '0A': 'm³',  // Water
      '0B': 'm³'   // Gas
    };
    
    return unitMap[type] || 'Wh';
  }
  
  getMockMeters() {
    return this.mockMeters;
  }

  generateTelegram() {
    // Pick a random meter
    const meter = this.mockMeters[Math.floor(Math.random() * this.mockMeters.length)];
    
    // Apply filter if configured
    if (this.config.devFilter && !this.config.devFilter.includes(meter.serial)) {
      return this.generateTelegram(); // Try again
    }
    
    // Increment value
    const now = new Date();
    const hoursSinceStart = (now.getTime() - Date.parse('2024-01-01')) / (1000 * 60 * 60);
    const currentValue = meter.initialValue + (meter.incrementPerDay / 24) * hoursSinceStart;
    
    // Generate realistic wM-Bus hex
    const hex = this.generateWmBusHex(meter, currentValue);
    
    return {
      hex,
      meter,
      value: currentValue,
      timestamp: now,
      rssi: -60 + Math.floor(Math.random() * 30)
    };
  }

  generateWmBusHex(meter, value) {
  // ---- Fixed constants ----
  const CONTROL = '44';      // Typical SND-NR
  const CI = '72';           // Variable data response
  const ACCESS_NUMBER = '00'; // Access number (increments with each telegram)
  const STATUS = '00';       // Status byte (0x00 = no errors)
  const CRC = '0000';        // Fake CRC (parser-safe)

  // ---- Manufacturer (2 bytes, NOT ASCII) ----
  const MANUFACTURER_MAP = {
    EFE: '2D2C',
    KAM: '2C2D',
    SON: '4E53',
    SEN: '4E45',
    HAG: '4748'
  };

  const manufacturerHex = MANUFACTURER_MAP[meter.manufacturer] ?? 'FFFF';

  // ---- Serial (4 bytes, LSB first) ----
  const serialHex = parseInt(meter.serial, 10)
    .toString(16)
    .padStart(8, '0')
    .match(/.{2}/g)
    .reverse()
    .join('');

  // ---- Version + Device type ----
  const versionHex = meter.version.padStart(2, '0');
  const typeHex = meter.type.padStart(2, '0');

  // ---- Data payload ----
  const scaledValue = Math.floor(value * 1000);
  const valueHex = scaledValue
    .toString(16)
    .padStart(8, '0')
    .match(/.{2}/g)
    .reverse()
    .join('');

  // Configuration word (2 bytes) - typically 0x0000 for unencrypted
  const configWord = '0000';

  // DIF/VIF for energy (0x0C = 32-bit integer, 0x13 = Energy in Wh)
  const dataRecords = '0C13' + valueHex;

  // ---- Assemble without length ----
  let body =
    CONTROL +
    manufacturerHex +
    serialHex +
    versionHex +
    typeHex +
    CI +
    ACCESS_NUMBER +
    STATUS +
    configWord +
    dataRecords +
    CRC;

  // ---- Length byte (total bytes AFTER length byte) ----
  const lengthByte = (body.length / 2)
    .toString(16)
    .padStart(2, '0');

  const telegram = (lengthByte + body).toUpperCase();

  return telegram;
}

}