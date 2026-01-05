class DatabaseService {
  constructor() { }

  insertMeterReading = async (meterId, meterManufacturer, meterType, meterDeviceType, version, status, accessNo, readings) => {
    console.log({ meterId, meterManufacturer, meterType, meterDeviceType, version, status, accessNo, readings }, 'Inserting meter reading');
  }
}


const databaseService = new DatabaseService();
export default databaseService;