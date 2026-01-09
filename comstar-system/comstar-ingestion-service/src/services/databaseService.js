import supabase from './supabaseClient.js';

class DatabaseService {
  constructor() { }

  insertMeterReading = async (meter_id, meterManufacturer, meterType, meter_device_type, version, status, accessNo, readings, local_meter_id, frame_type, encryption) => {
    console.log(meterId, meterManufacturer, meterType, meterDeviceType, version, status, accessNo, readings, local_meter_id, frame_type, encryption);
    
    try {
      const { data, error } = await supabase
        .from('parsed_data')
        .insert({
          local_meter_id,
          device_id: meter_id,
          device_type: meter_device_type,
          manufacturer: meterManufacturer,
          frame_type, version,
          access_number: accessNo,
          status,
          encryption,
          parsed_data: readings,
          created_at: new Date(),
          updated_at: new Date(),
          date_only: new Date().getDate()
        })

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

  getLocalMeterById = async (meterId) => {
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