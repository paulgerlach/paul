import supabase from './supabaseClient.js';

class DatabaseService {
  constructor() { }

  insertMeterReading = async (meter_id, meterManufacturer, meterType, meter_device_type, version, status, accessNo, readings, local_meter_id, frame_type, encryption) => {

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
        console.error('Error insert reading data:', error);
      }

    } catch (error) {
      console.error('Error insert reading data:', error);
      return null;
    }
  }

  checkExistingReading = async (local_meter_id, timestamp) => {
    try {
      const { data, error } = await supabase
        .from('parsed_data')
        .select('id')
        .eq('local_meter_id', local_meter_id)
        .contains('parsed_data', [{"description": "Time point", "value": timestamp}])
        .limit(1);

      if (error) {
        console.error('Error checking existing reading:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking existing reading:', error);
      return false;
    }
  }

  getLocalMeterById = async (meterId) => {
    try {
      const { data, error } = await supabase
        .from('local_meters')
        .select('*')
        .eq('meter_number', meterId)
        .single();

      if (error) {
        //replace with logger
        // console.error('Error fetching data:', error, meterId);
      }

      if (!data) {
        console.error({ meterId }, 'Unknown meter ID, skipping');
      }

      return data;
    } catch (error) {
      console.error('Error fetching meter by ID:', error);
      return null;
    }
  }

  async getDesiredGatewayState(gatewayEui) {
    try {
      const { data, error } = await supabase
        .from('gateway_desired_states')
        .select('*')
        .eq('gateway_eui', gatewayEui)
        .single();

      if (error) {
        //replace with logger
        console.error('Error fetching gateway_desired_states data:', error, gatewayEui);
      }

      if (!data) {
        console.error({ gatewayEui }, 'Unknown Gateway EUI');
      }

      return data;
    } catch (error) {
      console.error('Error Gateway State data:', error);
      return null;
    }
  }

  async setDesiredGatewayState(gatewayEui, desiredAppVersion, desiredBootVersion, desiredEtag) {
    try {
      const { data, error } = await supabase
        .from('gateway_desired_states')
        .upsert({
          gateway_eui: gatewayEui,
          desired_app_version: desiredAppVersion,
          desired_boot_version: desiredBootVersion,
          desired_etag: desiredEtag,
          updated_at: new Date()
        }, {
          onConflict: 'gateway_eui'
        })

      if (error) {
        console.error('Error setting desired gateway state:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error setting desired gateway state:', error);
      return null;
    }
  }

}


const databaseService = new DatabaseService();
export default databaseService;