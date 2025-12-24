
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
}