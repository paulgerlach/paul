import config from '../config/environment.js';
import databaseService from '../services/databaseService.js';

class DeviceHandler {
  constructor() {
    this.name = 'device';
    this.isUrgent = false;
    
    // Cache gateway info to avoid frequent DB writes
    this.gatewayCache = new Map();
    this.cacheTTL = config.gateway.configTtl || 24 * 60 * 60 * 1000; // 24 hours
    
    // Track when each gateway last sent device info
    this.lastDeviceUpdate = new Map();
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

      const sanitizedData = this.sanitizeDeviceData(data);
      console.log('Device uplink data sanitized successfully');

      // Check if we should skip (recent update)
      if (await this.shouldSkipUpdate(gatewayEui, sanitizedData)) {
        console.log({
          gatewayEui,
          reason: 'recent_update'
        }, 'Skipping device update (recent)');
        return;
      }

      const device = await this.getGatewayDeviceDetails(gatewayEui)

      if (!device) {
        await this.insertGatewayDeviceDetails(gatewayEui, data.model, sanitizedData)
      }

      //Store in Cache
      this.updateCache(gatewayEui, sanitizedData);
      console.log('Device uplink data cached successfully');
      
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

  sanitizeDeviceData(data) {
    const sanitized = { ...data };
    
    // Ensure EUI is uppercase
    if (sanitized.eui) {
      sanitized.eui = sanitized.eui.toUpperCase();
    }
    
    // Clean numeric fields
    if (sanitized.imei) {
      sanitized.imei = sanitized.imei.replace(/\D/g, '');
    }
    
    if (sanitized.imsi) {
      sanitized.imsi = sanitized.imsi.replace(/\D/g, '');
    }
    
    if (sanitized.iccid) {
      sanitized.iccid = sanitized.iccid.replace(/\D/g, '');
    }
    
    // Extract firmware version details
    if (sanitized.app) {
      const firmwareInfo = this.parseFirmwareVersion(sanitized.app);
      sanitized.firmware_details = firmwareInfo;
    }
    
    // Parse reboot reason
    if (sanitized.reboot_reason) {
      sanitized.reboot_details = this.parseRebootReason(sanitized.reboot_reason);
    }
    
    // Add timestamp
    sanitized.received_at = new Date().toISOString();
    
    return sanitized;
  }

  parseFirmwareVersion(firmwareString) {
    const patterns = [
      // app-nrf9160-wmbus v0.23.8-7+hw3 TZ2 (Feb 15 2024 18:19:58)
      /^(?<name>[\w-]+)\s+v?(?<version>[\d\.]+(?:-[\d+]+)?(?:\+[\w]+)?)\s*(?<variant>\w+)?/i,
      // app-nrf91-origin+0.1.7.hex
      /^(?<name>[\w-]+)\+(?<version>[\d\.]+)\.hex$/i
    ];
    
    for (const pattern of patterns) {
      const match = firmwareString.match(pattern);
      if (match) {
        return {
          full: firmwareString,
          name: match.groups?.name,
          version: match.groups?.version,
          variant: match.groups?.variant,
          is_secure: firmwareString.includes('secure') || firmwareString.includes('TZ'),
          has_hardware: firmwareString.includes('+hw')
        };
      }
    }
    
    return {
      full: firmwareString,
      name: 'unknown',
      version: 'unknown',
      variant: null,
      is_secure: false,
      has_hardware: false
    };
  }

  parseRebootReason(reason) {
    const commonReasons = {
      'power on': { type: 'power', severity: 'info' },
      'nRESET pin pulled low': { type: 'reset', severity: 'warning' },
      'watchdog timeout': { type: 'watchdog', severity: 'error' },
      'config_update': { type: 'config', severity: 'info' },
      'firmware_update': { type: 'firmware', severity: 'info' },
      'assert': { type: 'assert', severity: 'error' },
      'low voltage': { type: 'power', severity: 'warning' }
    };
    
    const lowerReason = reason.toLowerCase();
    
    for (const [key, info] of Object.entries(commonReasons)) {
      if (lowerReason.includes(key.toLowerCase())) {
        return {
          original: reason,
          type: info.type,
          severity: info.severity,
          matched_pattern: key
        };
      }
    }
    
    return {
      original: reason,
      type: 'unknown',
      severity: 'warning',
      matched_pattern: null
    };
  }

  shouldSkipUpdate(gatewayEui, currentData) {
    // Always process first-time gateways
    if (!this.gatewayCache.has(gatewayEui)) {
      return false;
    }
    
    const lastUpdate = this.lastDeviceUpdate.get(gatewayEui);
    const cachedData = this.gatewayCache.get(gatewayEui);
    
    // Skip if updated less than 1 hour ago AND data hasn't changed
    if (lastUpdate && Date.now() - lastUpdate < 3600000) { // 1 hour
      // Check if any critical fields changed
      const criticalFields = ['imei', 'imsi', 'iccid', 'app', 'boot', 'model'];
      const hasChanges = criticalFields.some(field => 
        currentData[field] !== cachedData[field]
      );
      
      if (!hasChanges) {
        return true;
      }
    }
  }

  async getGatewayDeviceDetails(gatewayEui) {
    try {
      return await databaseService.getGatewayDeviceDetailsByGatewayEui(gatewayEui);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async insertGatewayDeviceDetails(gatewayEui, model, data) {
    try {
      const metadata = {
        board: data.board,
        hwversion: data.hwversion,
        modem_firmware: data.modem,
        mcu_bootloader: data.mcu,

        // Reboot info
        last_reboot: {
          code: data.reboot_code,
          reason: data.reboot_reason,
          assert_message: data.assert,
          final_words: data.final_words,
          parsed: data.reboot_details // From your sanitize method
        },

        firmware_details: data.firmware_details,

        // Additional info that might be present
        capabilities: this.extractCapabilities(data),
      };

      // Clean up undefined values
      Object.keys(metadata).forEach(key => 
        metadata[key] === undefined && delete metadata[key]
      );
      return await databaseService.insertGatewayDeviceDetails(gatewayEui, model, metadata, data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  updateCache(gatewayEui, data) {
    this.gatewayCache.set(gatewayEui, {
      ...data,
      cached_at: Date.now()
    });
    
    // Clean old cache entries
    this.cleanCache();
  }
  
  cleanCache() {
    const now = Date.now();
    for (const [eui, data] of this.gatewayCache.entries()) {
      if (now - data.cached_at > this.cacheTTL) {
        this.gatewayCache.delete(eui);
        this.lastDeviceUpdate.delete(eui);
      }
    }
  }

  extractCapabilities(data) {
  const capabilities = ['wmbus']; // All gateways have wmbus
  
  // Check for communication capabilities
  if (data.model?.includes('nRF9160')) {
    capabilities.push('lte-m', 'nb-iot');
  }
  
  // Check if LoRaWAN is supported
  if (data.metadata?.wan_capabilities?.includes('lorawan') || 
      data.model?.toLowerCase().includes('sx')) {
    capabilities.push('lorawan');
  }
  
  return capabilities;
}
  
}

const deviceHandler = new DeviceHandler();
export default deviceHandler