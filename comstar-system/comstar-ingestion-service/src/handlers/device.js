import CborUtils from "../utils/cbor.js";

class DeviceHandler {
  constructor() {
    this.name = 'device';
    this.isUrgent = false;
  }

  async handle({ gatewayEui, data }) {
    // Just log it and move on
    console.log('📱 DEVICE UPLINK:', {
      gateway: gatewayEui,
      firmware: data.app?.substring(0, 30) || 'none',
      model: data.model || 'unknown',
      reboot: data.reboot_reason || 'none'
    });

    try {
      if(data.reboot_reason === 'power_on') 
        this.validateDeviceBootData(data, gatewayEui);
      else
        this.validateDeviceConfigData(data, gatewayEui);

      console.log('Device uplink data validated successfully');

      return {
        success: true,
        gatewayId: 0,
        cached: false,
        processedAt: new Date()
      };
    } catch (error) { 
      console.error({
        gatewayEui,
        error: error.message,
        stack: error.stack,
        data: JSON.stringify(data)
      }, 'Failed to process device uplink');
      
      //TODO: Possibly store failed attempt      
      throw error;
    }


    
    return;
  }

  validateDeviceBootData(data, gatewayEui) {
    const requiredFields = [
      'imei',
      'imsi', 
      'iccid',
      'eui',
      'model',
      'app'
    ];
    
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== '') {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Validate EUI matches topic
    if (data.eui && data.eui.toLowerCase() !== gatewayEui.toLowerCase()) {
      throw new Error(`EUI mismatch: topic ${gatewayEui} != payload ${data.eui}`);
    }
    
    // Validate IMEI format (15-17 digits)
    if (data.imei && !/^\d{15,17}$/.test(data.imei.replace(/\D/g, ''))) {
      console.warn({
        gatewayEui,
        imei: data.imei
      }, 'Invalid IMEI format');
    }
    
    // Validate ICCID format (19-22 digits)
    if (data.iccid && !/^\d{19,22}$/.test(data.iccid.replace(/\D/g, ''))) {
      console.warn({
        gatewayEui, 
        iccid: data.iccid
      }, 'Invalid ICCID format');
    }
    
    return true;
  }

  validateDeviceConfigData(data, gatewayEui) { 
    // Example validation: check for presence of config version
    if (!data.etag) {
      throw new Error('Missing etag in device config data');
    }
  }
}

const deviceHandler = new DeviceHandler();
export default deviceHandler