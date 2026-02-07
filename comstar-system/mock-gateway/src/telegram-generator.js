export class TelegramGenerator { 
  constructor(config) { 
    this.config = config;
    
    // Define all manufacturers and their device types
    this.manufacturers = [
      'DWZ', 'EFE', 'EIE', 'EMH', 'FAC', 'HAG', 
      'HYD', 'ITW', 'KAM', 'LAS', 'MWU', 'QDS', 
      'SEN', 'SON', 'TCH', 'WEH'
    ];
    
    this.deviceTypes = {
      'DWZ': ['07'],  // Water
      'EFE': ['04', '07', '08'],  // Heat, Water, Heat cost allocator
      'EIE': ['1A'],  // SmokeDetector
      'EMH': ['02', '03'],  // Electricity
      'FAC': ['1A'],  // SmokeDetector
      'HAG': ['1A'],  // SmokeDetector
      'HYD': ['07'],  // Water
      'ITW': ['08'],  // HCA (Heat Cost Allocator)
      'KAM': ['04', '0B'],  // Heat, Gas
      'LAS': ['19'],  // Repeater
      'MWU': ['08', '25'],  // HCA, Communications controller
      'QDS': ['08'],  // HCA
      'SEN': ['07', '0B'],  // Water, Gas
      'SON': ['1A'],  // SmokeDetector
      'TCH': ['08'],  // HCA
      'WEH': ['07']   // Water
    };

    this.mockMeters = this.generateMockMeters();
    this.accessNumberCounter = 0;
  }

  generateMockMeters() {
    const meters = [];
    const serials = ['12345678', '87654321', '11223344', '44332211', '55667788'];
    
    serials.forEach(serial => {
      const manufacturer = this.manufacturers[Math.floor(Math.random() * this.manufacturers.length)];
      const types = this.deviceTypes[manufacturer] || ['08'];
      const type = types[Math.floor(Math.random() * types.length)];
      
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
      '04': 'kWh', // Heat
      '07': 'm³',  // Water
      '08': 'units', // Heat cost allocator (HCA)
      '0B': 'm³',  // Gas
      '19': 'cnt', // Repeater
      '1A': 'cnt', // Smoke detector
      '25': 'cnt'  // Communications controller
    };
    
    return unitMap[type] || 'cnt';
  }
  
  getDeviceTypeDescription(type) {
    const typeMap = {
      '02': 'Elec',
      '03': 'Elec',
      '04': 'Heat',
      '07': 'Water',
      '08': 'HCA',
      '0B': 'Gas',
      '19': 'Repeater',
      '1A': 'SmokeDetector',
      '25': 'CommsController'
    };
    
    return typeMap[type] || 'Unknown';
  }

  getMockMeters() {
    return this.mockMeters;
  }

  generateMockParsedData(meter, value) {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    
    const deviceTypeDesc = this.getDeviceTypeDescription(meter.type);
    
    const parsedData = {
      "ID": parseInt(meter.serial),
      "Status": "00h",
      "Version": meter.version + "h",
      "Encryption": 0,
      "Frame Type": "SND_NR",
      "Device Type": deviceTypeDesc,
      "Manufacturer": meter.manufacturer,
      "Access Number": Math.floor(Math.random() * 256),
      [`IV,0,0,0,${meter.unit},E`]: Math.floor(value),
      [`IV,0,0,0,,Date/Time`]: `${day}.${month}.${year} ${hour}:${minute}`
    };

    return parsedData;
  }

  generateTelegram() {
    const meter = this.mockMeters[Math.floor(Math.random() * this.mockMeters.length)];
    
    if (this.config.devFilter && !this.config.devFilter.includes(meter.serial)) {
      return null;
    }
    
    const now = new Date();
    const hoursSinceStart = (now.getTime() - Date.parse('2024-01-01')) / (1000 * 60 * 60);
    const currentValue = meter.initialValue + (meter.incrementPerDay / 24) * hoursSinceStart;
    
    const telegram = this.generateWmBusHex(meter, currentValue);

    return {telegram, meter};
  }

  // Convert 3-letter manufacturer code to 2-byte hex (M-field)
  // Formula: ((c1-64)*32 + (c2-64))*32 + (c3-64) encoded as 2 bytes little-endian
  encodeManufacturer(mfr) {
    const c1 = mfr.charCodeAt(0) - 64;
    const c2 = mfr.charCodeAt(1) - 64;
    const c3 = mfr.charCodeAt(2) - 64;
    
    const value = ((c1 * 32 + c2) * 32 + c3);
    
    // Convert to 2-byte little-endian hex
    const byte1 = (value & 0xFF).toString(16).padStart(2, '0');
    const byte2 = ((value >> 8) & 0xFF).toString(16).padStart(2, '0');
    
    return byte1 + byte2;
  }

  generateWmBusHex(meter, value) {
  // According to documentation, telegrams should be WITHOUT CRC
  // C-field: 0x44 = SND-NR (Send, no reply)
  const CONTROL = '44';
  
  // M-field: Manufacturer (2 bytes, special encoding)
  const manufacturerHex = this.encodeManufacturer(meter.manufacturer);
  
  // A-field: Serial number (4 bytes, little-endian BCD)
  const serialHex = this.encodeBCD(meter.serial);
  
  // Version (1 byte)
  const versionHex = parseInt(meter.version, 10).toString(16).padStart(2, '0');
  
  // Medium/Device type (1 byte)
  const typeHex = meter.type.padStart(2, '0');
  
  // CI-field: 0x72 = Variable data response
  const CI = '72';
  
  // Access number (1 byte) - increments with each telegram
  this.accessNumberCounter = (this.accessNumberCounter + 1) % 256;
  const ACCESS_NUMBER = this.accessNumberCounter.toString(16).padStart(2, '0');
  
  // Status byte (1 byte)
  // Bit 7: Permanent error (0=no, 1=yes)
  // Bit 6: Temporary error (0=no, 1=yes)
  // Bit 5: Reserved
  // Bit 4: Encrypted (0=no, 1=yes)
  // Bit 3-0: Battery status (0=low, 1=OK, 2-14=reserved, 15=external power)
  const STATUS = '00'; // No errors, not encrypted, battery OK
  
  // Configuration word (2 bytes) - REQUIRED for CI=0x72
  // Bits 15-12: AES mode (0=no encryption, 2=CBC, 3=CTR)
  // Bits 11-8: Accessibility (0=always, 1=during predefined window)
  // Bits 7-0: RFU (should be 0)
  const CONFIG_WORD = '0000'; // No encryption, always accessible
  
  // Generate data records - ensure we have enough data for valid telegram
  const dataRecords = this.generateDataRecords(meter, value);
  
  // Assemble telegram body (without length byte)
  const body = 
    CONTROL +
    manufacturerHex +
    serialHex +
    versionHex +
    typeHex +
    CI +
    ACCESS_NUMBER +
    STATUS +
    CONFIG_WORD +
    dataRecords;
  
  // Calculate length (number of bytes after length byte)
  const bodyBytes = body.length / 2;
  const lengthByte = bodyBytes.toString(16).padStart(2, '0');
  
  // Final telegram WITHOUT CRC (as per documentation page 13)
  const telegram = (lengthByte + body).toUpperCase();
  
  // Debug: Check telegram length
  const totalBytes = telegram.length / 2;
  console.log(`Generated telegram: ${telegram.length} chars, ${totalBytes} bytes`);
  console.log(`Body length: ${bodyBytes} bytes`);
  
  if (totalBytes < 50) {
    console.warn(`⚠️ Telegram is only ${totalBytes} bytes, expected at least 50 bytes`);
    // Pad with zeros to reach minimum length
    const paddingNeeded = 50 - totalBytes;
    const padding = '00'.repeat(paddingNeeded);
    return telegram + padding;
  }
  
  return telegram;
}

// Updated data records generator to create longer telegrams
generateDataRecords(meter, value) {
  let records = '';
  
  // First record: Main value (32-bit integer)
  const scaledValue = this.getScaledValue(meter.type, value);
  const vif = this.getVIFForType(meter.type);
  
  // DIF: 0x04 = 32-bit integer, no extension
  records += '04' + vif + this.encodeValue32(scaledValue);
  
  // Second record: Add timestamp (mandatory for many meters)
  const now = new Date();
  
  // DIF: 0x0C = 32-bit integer with time extension
  // VIF: 0x6C = Date & time (type G)
  const timestamp = this.encodeTimestamp(now);
  records += '0C6C' + timestamp;
  
  // Third record: Add status information
  // DIF: 0x02 = 8-bit integer
  // VIF: 0xFD = Extended VIF
  // VIFE: 0x17 = Status information
  const statusInfo = 'FD17';
  const statusByte = '00'; // No errors
  records += '02' + statusInfo + statusByte;
  
  // Fourth record: Add battery voltage (optional but makes telegram longer)
  // DIF: 0x04 = 32-bit integer
  // VIF: 0xFD2B = Battery voltage in mV (extended VIF)
  const batteryVoltage = Math.floor(3600 + Math.random() * 300); // 3600-3900 mV
  records += '04FD2B' + this.encodeValue32(batteryVoltage);
  
  return records;
}

// Encode timestamp as 4 bytes little-endian
encodeTimestamp(date) {
  const year = date.getFullYear() - 2000; // Years since 2000
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  // Format according to wMBus time format (Type G):
  // Byte 0: Minute
  // Byte 1: Hour
  // Byte 2: Day
  // Byte 3: (Month << 4) | (Year & 0x0F)
  
  const minuteByte = minute & 0x3F;
  const hourByte = hour & 0x1F;
  const dayByte = day & 0x1F;
  const monthYearByte = ((year & 0x0F) << 4) | (month & 0x0F);
  
  // Encode as little-endian hex
  const hex = 
    minuteByte.toString(16).padStart(2, '0') +
    hourByte.toString(16).padStart(2, '0') +
    dayByte.toString(16).padStart(2, '0') +
    monthYearByte.toString(16).padStart(2, '0');
  
  return hex;
}

// Helper method to encode 32-bit value as little-endian
encodeValue32(value) {
  const intValue = Math.floor(value);
  const hex = intValue.toString(16).padStart(8, '0');
  return hex.match(/.{2}/g).reverse().join('');
}

// Also need to fix the encodeBCD method to ensure proper serial encoding
encodeBCD(serial) {
  // Ensure serial is 8 digits
  const paddedSerial = serial.padStart(8, '0');
  
  // Convert to BCD: each digit becomes a nibble (4 bits)
  // For wMBus, serial is stored as 4 bytes (8 BCD digits)
  let hex = '';
  
  for (let i = 0; i < 8; i += 2) {
    const highDigit = parseInt(paddedSerial.charAt(i), 10);
    const lowDigit = parseInt(paddedSerial.charAt(i + 1), 10);
    const byte = (highDigit << 4) | lowDigit;
    hex += byte.toString(16).padStart(2, '0');
  }
  
  // Reverse for little-endian
  return hex.match(/.{2}/g).reverse().join('');
}

// Add this method for proper VIF encoding based on type
getVIFForType(type) {
  const vifMap = {
    '02': '06', // Energy Wh (0.001 kWh)
    '03': '06', // Energy Wh
    '04': '06', // Energy Wh (heat)
    '07': '13', // Volume m³ (0.001 m³ = liters)
    '08': 'FD17', // HCA units (extended VIF)
    '0B': '16', // Volume m³ (gas)
    '19': 'FD17', // Repeater
    '1A': 'FD17', // Smoke detector
    '25': 'FD17'  // Communications controller
  };
  
  return vifMap[type] || 'FD17';
}

// Ensure scaled values are appropriate
getScaledValue(type, value) {
  // Scale values appropriately for VIF encoding
  if (['02', '03', '04'].includes(type)) {
    return Math.floor(value * 1000); // kWh to Wh
  } else if (['07', '0B'].includes(type)) {
    return Math.floor(value * 1000); // m³ to liters
  } else {
    return Math.floor(value * 100); // Scale for better precision
  }
}

}