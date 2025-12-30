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
    // C-field: 0x44 = SND-NR (Send, no reply)
    const CONTROL = '44';
    
    // M-field: Manufacturer (2 bytes, special encoding)
    const manufacturerHex = this.encodeManufacturer(meter.manufacturer);
    
    // A-field: Serial number (4 bytes, little-endian BCD)
    const serialHex = this.encodeBCD(meter.serial);
    
    // Version
    const versionHex = parseInt(meter.version, 10).toString(16).padStart(2, '0');
    
    // Medium/Device type
    const typeHex = meter.type.padStart(2, '0');
    
    // CI-field: 0x72 = Variable data response
    const CI = '72';
    
    // Access number (increments with each telegram)
    this.accessNumberCounter = (this.accessNumberCounter + 1) % 256;
    const ACCESS_NUMBER = this.accessNumberCounter.toString(16).padStart(2, '0');
    
    // Status byte
    const STATUS = '00';
    
    // Configuration word (2 bytes) - CRITICAL for wireless M-Bus with CI=0x72
    // Bits indicate encryption mode, accessibility, etc.
    // 0x0000 = no encryption, no special features
    const CONFIG_WORD = '0000';
    
    // Generate data records
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
    const lengthByte = (body.length / 2).toString(16).padStart(2, '0');
    
    // Final telegram (NO CRC - gateway strips it)
    const telegram = (lengthByte + body).toUpperCase();
    
    return telegram;
  }

  // Encode serial number as BCD (Binary Coded Decimal), little-endian
  encodeBCD(serial) {
    // Convert each digit to its BCD representation
    const digits = serial.padStart(8, '0');
    let hex = '';
    
    for (let i = 0; i < 8; i += 2) {
      const byte = digits.substr(i, 2);
      hex += byte;
    }
    
    // Convert to little-endian (reverse byte order)
    return hex.match(/.{2}/g).reverse().join('');
  }

  generateDataRecords(meter, value) {
    let records = '';
    
    // Main reading - DIF=0x04 (32-bit integer), VIF depends on type
    const scaledValue = this.getScaledValue(meter.type, value);
    const vif = this.getVIFForType(meter.type);
    
    // DIF: 0x04 = 32-bit integer, no extension
    // VIF: depends on unit
    // Value: 4 bytes, little-endian
    records += '04' + vif + this.encodeValue32(scaledValue);
    
    // Don't add additional records for now - keep it simple
    // The parser might be expecting a specific structure
    
    return records;
  }

  getScaledValue(type, value) {
    // Scale based on VIF encoding
    if (['02', '03', '04'].includes(type)) {
      return Math.floor(value * 1000); // kWh to Wh
    } else if (['07', '0B'].includes(type)) {
      return Math.floor(value * 1000); // m³ to liters  
    } else {
      return Math.floor(value);
    }
  }

  getVIFForType(type) {
    const vifMap = {
      '02': '06', // Energy Wh
      '03': '06', // Energy Wh
      '04': '06', // Energy Wh (heat)
      '07': '13', // Volume m³ (E-3 m³ = liters)
      '08': 'FD17', // HCA units (extended VIF + VIFE)
      '0B': '16', // Volume m³ (gas)
      '19': 'FD17', // Repeater
      '1A': 'FD17', // Smoke detector
      '25': 'FD17'  // Communications controller
    };
    return vifMap[type] || 'FD17';
  }

  encodeValue32(value) {
    // Encode as 32-bit little-endian hex
    const intValue = Math.floor(value);
    const hex = intValue.toString(16).padStart(8, '0');
    return hex.match(/.{2}/g).reverse().join('');
  }

  getAccessNumber() {
    return this.accessNumberCounter;
  }
}