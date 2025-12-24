import { randomUUID } from 'crypto';

const MANUFACTURER_MAP = {
  EFE: 'Engelmann Sensor',
  // HAG: 'Hydrometer (Diehl Metering)',
  // KAM: 'Kamstrup',
  // SON: 'Sontex',
  // SEN: 'Sensus (Xylem)',
};

export class TelegramGenerator { 
  constructor(config) { 
    this.config = config;
    this.manufacturers = Object.keys(MANUFACTURER_MAP); //['EFE', 'HAG', 'KAM', 'SON', 'SEN'];
    this.deviceTypes = {
      'EFE': ['07', '08'],  // Heat meters, Heat cost allocators
      // 'HAG': ['02', '0A'],  // Water meters
      // 'KAM': ['02', '03'],  // Electricity meters
      // 'SON': ['03', '07'],  // Various
      // 'SEN': ['0A', '0B']   // Water, Gas
    };

    this.mockMeters = this.generateMockMeters();
  }

  generateMockMeters() {
    const meters = [];
    const serials = ['12345678', '87654321', '11223344', '44332211', '55667788'];
    
    serials.forEach(serial => {
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
    // Generate realistic-looking wM-Bus telegram
    const header = '2A44'; // Standard header
    
    // Manufacturer ID (3 bytes ASCII)
    const manufacturerHex = Buffer.from(meter.manufacturer).toString('hex');
    
    // Serial number (4 bytes, LSB first)
    const serialNum = parseInt(meter.serial);
    const serialHex = serialNum.toString(16).padStart(8, '0');
    // Reverse for LSB first
    const serialBytes = serialHex.match(/.{2}/g).reverse().join('');
    
    // Version and type
    const versionHex = meter.version.padStart(2, '0');
    const typeHex = meter.type.padStart(2, '0');
    
    // Data field header (simplified)
    const dataHeader = '2F2F';
    
    // Value (4 bytes, scaled)
    const scaledValue = Math.floor(value * 1000); // Scale to integer
    const valueHex = scaledValue.toString(16).padStart(8, '0');
    const valueBytes = valueHex.match(/.{2}/g).reverse().join('');
    
    // Combine
    let telegram = header + manufacturerHex + serialBytes + versionHex + typeHex + dataHeader + valueBytes;
    
    // Add random padding to look real
    const padding = randomUUID().replace(/-/g, '').substring(0, 20);
    telegram += padding;
    
    // Ensure even length
    if (telegram.length % 2 !== 0) {
      telegram += '0';
    }
    
    return telegram.toUpperCase();
  }
}