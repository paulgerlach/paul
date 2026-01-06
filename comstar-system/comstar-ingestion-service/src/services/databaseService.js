import supabase from './supabaseClient.js';

class DatabaseService {
  constructor() { }

  insertMeterReading = async (meterId, meterManufacturer, meterType, meterDeviceType, version, status, accessNo, readings) => {
    console.log(meterId, meterManufacturer, meterType, meterDeviceType, version, status, accessNo);
    readings.map(async (reading) => {
      console.log(reading.info)
    });
  }

  getMeterById = async (meterId) => {
    try {
      const { data, error } = await supabase
        .from('local_meters')
        .select('*')
        .eq('meter_number', meterId);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('Data:', data);
      }
      
    } catch (error) {
      console.error('Error fetching meter by ID:', error);
      return null;
    }
  }
}


const databaseService = new DatabaseService();
export default databaseService;