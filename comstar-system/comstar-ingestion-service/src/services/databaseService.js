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
          frame_type, frame_type,
          version: version,
          access_number: accessNo,
          status,
          encryption,
          parsed_data: readings,
          created_at: new Date(),
          updated_at: new Date(),
          date_only: new Date().toISOString().substring(0, 10)
        })

      if (error) {
        console.error('Error insert reading data:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error insert reading data:', error);
      throw error;
    }
  }

  checkExistingReading = async (local_id, timestamp) => {
    try {
      const { data, error } = await supabase
        .from('parsed_data')
        .select('id')
        .eq('local_meter_id', local_id)
        .contains('parsed_data', {"description": "Time point", "value": timestamp})
        .limit(1);

      if (error) {
        console.error('Error checking existing reading:', error);
        throw error;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking existing reading:', error);
      throw error;
    }
  }

  getLocalMeterById = async (meterId) => {
    try {
      const { data, error } = await supabase
        .from('local_meters')
        .select('*')
        .eq('meter_number', meterId)
        .maybeSingle();

      if (error) {
        //replace with logger
        console.error('Error fetching data:', error, meterId);
        throw error;
      }

      if (!data) {
        console.error({ meterId }, 'Unknown meter ID, skipping');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching meter by ID:', error);
      throw error;
    }
  }

  async getDesiredGatewayState(gatewayEui) {
    try {
      const { data, error } = await supabase
        .from('gateway_desired_states')
        .select('*')
        .eq('gateway_eui', gatewayEui)
        

      if (error) {
        //replace with logger
        console.error('Error fetching gateway_desired_states data:', error, gatewayEui);
        throw error;
      }

      if (!data) {
        console.error({ gatewayEui }, 'Unknown Gateway EUI');
        return null;
      }

      return data[0];
    } catch (error) {
      console.error('Error Gateway State data:', error);
      return error;
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
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error setting desired gateway state:', error);
      return error;
    }
  }

  async getConfiguration(gatewayEui, etag) {
    try {
      const { data, error } = await supabase
        .from('gateway_desired_states')
        .select('*')
        .eq('gateway_eui', gatewayEui)
        .eq('etag', etag)
        .maybeSingle();

      if (error) {
        //replace with logger
        console.error('Error fetching gateway_desired_states data:', error, gatewayEui);
        throw error;
      }

      if (!data) {
        console.error({ gatewayEui }, 'Unknown Gateway EUI');
        return null
      }

      return data;
    } catch (error) {
      console.error('Error Gateway State data:', error);
      throw error;
    }
  }

  async insertGatewayStatus(
        gateway_eui,
        timestamp,
        sync_from,
        sync_to,
        sync_ticks,
        monitor,
        ci,
        tac,
        rsrp,
        snr,
        operator,
        band,
        apn, //apn
        vbat,
        temperature,
        collected,
        telegram_count,
    uploading_count,
        time
  ) {
    try {
      const { data, error } = await supabase
        .from('gateway_status')
        .insert({
        gateway_eui,
        timestamp,
        sync_from,
        sync_to,
        sync_ticks,
        monitor,
        ci,
        tac,
        rsrp,
        snr,
        operator,
        band,
        apn, //apn
        vbat,
        temperature : parseInt(temperature),
        collected,
        telegram_count,
          uploading_count,
        time
        })

      if (error) {
        console.error('Error insert gateway status data:', error);
        throw error
      }

    } catch (error) {
      console.error('Error gateway status data:', error);
      throw error;
    }
  }

  

  async insertGatewayAlert(
    gateway_eui,
    alert_type,
    severity,
    message,
    alertData,
    date
  ) {
    try {
      const { data, error } = await supabase
        .from('gateway_alerts')
        .insert({
        gateway_eui,
        alert_type,
        severity,
        message,
        data: alertData,
        created_at : date,
        resolved_at: date,
        updated_at: date
        })

      if (error) {
        console.error('Error insert gateway alerts data:', error);
      }

    } catch (error) {
      console.error('Error gateway alerts data:', error);
      throw error;
    }
  }


  async getGatewayDeviceDetailsByGatewayEui(gatewayEui) { 
    try {
      const { data, error } = await supabase
        .from('gateway_devices')
        .select('*')
        .eq('eui', gatewayEui)

      if (error) {
        //replace with logger
        console.error('Error fetching gateway device data:', error, gatewayEui);
        return null;
      }

      if (!data) {
        console.error({ gatewayEui }, 'Unknown Gateway EUI');
      }

      return data[0];
    } catch (error) {
      console.error('Error Gateway Device data:', error);
      throw error;
    }
  }

  async insertGatewayDeviceDetails(gateway_eui, model, metadata, gatewayData) {
    try {
      const { data, error } = await supabase
        .from('gateway_devices')
        .insert({
          eui: gateway_eui,
          imei: gatewayData.imei,
          imsi: gatewayData.imsi,
          iccid: gatewayData.iccid,
          model: model,
          firmware: gatewayData.firmware_details.name,
          boot_version: gatewayData.firmware_details.version,
          last_seen: gatewayData.received_at,
          metadata: metadata,

        })

      if (error) {
        console.error('Error insert gateway device details data:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error gateway device details data:', error);
      throw error;
    }
  }

  async saveTelegramDetails(
    gateway_eui, timestamp, telegram_hex, rssi, mode, type, meter_number, manufacturer_code, version, device_type
  ) {
    try {
      const { data, error } = await supabase
        .from('wmbus_telegrams')
        .insert({
          gateway_eui, timestamp, telegram_hex, rssi, mode, type, meter_number, manufacturer_code, version, device_type
        })

      if (error) {
        console.error('Error inserting wmbus telegram data:', error);
        throw error;
      }

    } catch (error) {
      console.error('Error inserting wmbus telegram  data:', error);
      throw error;
    }
  }

  async query(sql, params = []) {
    try {
      const result = await supabase.postgres.query(sql, params);
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

}


const databaseService = new DatabaseService();
export default databaseService;