import databaseService from '../services/databaseService.js'

class StatusHandler {
  constructor() {
    this.name = 'status';
    this.isUrgent = false;
    
    // Cache to prevent excessive DB writes
    this.lastStatusUpdate = new Map();
    this.minUpdateInterval = 30000; // 30 seconds minimum between updates
    
    // Thresholds for alerts
    this.thresholds = {
      battery: {
        critical: 3500, // mV - immediate attention needed
        warning: 3600,  // mV - monitor closely
        normal: 3700    // mV - healthy
      },
      temperature: {
        high: 600,      // 60°C - too hot
        low: -100,      // -10°C - too cold
        normal: 250     // 25°C - ideal
      },
      signal: {
        poor: 80,       // RSRP > -80 dBm is poor
        fair: 70,       // RSRP > -70 dBm is fair
        good: 60        // RSRP > -60 dBm is good
      },
      uptime: {
        rebootThreshold: 300000 // 5 minutes - if uptime less than this, recent reboot
      }
    };
  }
  
  async handle({ gatewayEui, data, timestamp }) {
    try {
      // Log basic info
      console.log('📊 Status update from:', gatewayEui);
      
      // Check if we should skip (too frequent updates)
      if (this.shouldSkipUpdate(gatewayEui)) {
        console.log('⏭️  Skipping frequent status update');
        return { skipped: true, reason: 'too_frequent' };
      }
      
      // Parse and validate status data
      const status = this.parseStatusData(data, gatewayEui);
      
      // Log human-readable summary
      this.logStatusSummary(gatewayEui, status);
      
      // Store in database
      await this.storeStatus(gatewayEui, status);
      
      // Check for alerts
      const alerts = await this.checkAlerts(gatewayEui, status);
      
      // Update cache
      this.lastStatusUpdate.set(gatewayEui, Date.now());
      
      return {
        success: true,
        stored: true,
        alerts: alerts.length,
        gatewayEui,
        timestamp: new Date()
      };
      
    } catch (error) {
      console.error('❌ Status handler error:', error.message);
      return {
        success: false,
        error: error.message,
        gatewayEui
      };
    }
  }
  
  parseStatusData(data, gatewayEui) {
    console.log("PARSE STATUS DATA====>", data)
    // Basic validation
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid status data format');
    }
    
    const now = Date.now();
    
    // Parse the status object
    return {
      // Timestamps
      received_at: new Date().toISOString(),
      gateway_time: data.time ? new Date(data.time * 1000).toISOString() : null,
      
      // Battery
      battery: {
        voltage: data.vbat || null, // mV
        level: this.calculateBatteryLevel(data.vbat),
        charging: data.vbat > 4000 // Simple assumption
      },
      
      // Temperature
      temperature: {
        raw: data.temperature || null, // 0.1°C units
        celsius: data.temperature ? data.temperature / 10 : null,
        fahrenheit: data.temperature ? (data.temperature / 10) * 9/5 + 32 : null
      },
      
      // Cellular Signal
      signal: {
        rsrp: data.rsrp || null, // Received signal power
        rsrq: data.rsrq || null, // Received signal quality
        snr: data.snr || null,   // Signal to noise ratio
        band: data.band || null,
        operator: data.operator || null,
        cell_id: data.ci || null,
        tac: data.tac || null,
        
        // Human readable
        strength: this.getSignalStrength(data.rsrp),
        quality: this.getSignalQuality(data.rsrq)
      },
      
      // Network
      network: {
        apn: data.apn || null,
        connected: data.monitor ? data.monitor.includes('connected:1') : false,
        monitor_string: data.monitor || '',
        
        // Parse monitor string for more details
        parsed_monitor: this.parseMonitorString(data.monitor)
      },
      
      // Collection stats
      collection: {
        active: data.collected === data.telegram  || false,
        telegrams_collected: data.telegram || 0,
        telegrams_uploading: data.uploading || 0,
        last_collection_time: data.time ? new Date(data.time * 1000) : null
      },
      
      // Time sync
      time_sync: {
        gateway_time: data.time || null,
        sync_to: data.syncTo || null,
        sync_from: data.syncFrom || null,
        sync_ticks: data.syncTicks || null,
        sync_status: this.checkTimeSyncStatus(data)
      },
      
      // Metadata
      metadata: {
        raw_data: data,
        parsed_at: now,
        gateway_eui: gatewayEui
      }
    };
  }
  
  parseMonitorString(monitor) {
    if (!monitor) return {};
    
    try {
      const result = {};
      
      // Example: "connected:1, reg:5, tac:D71E, ci:019C1307, psm:00000001"
      const parts = monitor.split(',');
      
      parts.forEach(part => {
        const [key, value] = part.split(':').map(s => s.trim());
        if (key && value !== undefined) {
          result[key] = value;
        }
      });
      
      return result;
      
    } catch (error) {
      console.warn('Failed to parse monitor string:', monitor);
      return {};
    }
  }
  
  calculateBatteryLevel(voltage) {
    if (!voltage) return 'unknown';
    
    // Typical Li-ion battery curve
    if (voltage >= 4100) return 'full';      // 4.1V+
    if (voltage >= 3900) return 'high';      // 3.9V - 4.1V
    if (voltage >= 3700) return 'medium';    // 3.7V - 3.9V
    if (voltage >= 3500) return 'low';       // 3.5V - 3.7V
    return 'critical';                       // < 3.5V
  }
  
  getSignalStrength(rsrp) {
    if (!rsrp) return 'unknown';
    
    // Convert RSRP to dBm (ComStar uses modem values)
    const rsrpDb = rsrp - 140;
    
    if (rsrpDb >= -80) return 'poor';
    if (rsrpDb >= -90) return 'fair';
    if (rsrpDb >= -100) return 'good';
    return 'excellent';
  }
  
  getSignalQuality(rsrq) {
    if (!rsrq) return 'unknown';
    
    // Convert RSRQ to dB
    const rsrqDb = rsrq / 2 - 19.5;
    
    if (rsrqDb >= -9) return 'excellent';
    if (rsrqDb >= -12) return 'good';
    if (rsrqDb >= -15) return 'fair';
    return 'poor';
  }
  
  checkTimeSyncStatus(data) {
    if (!data.syncTo || !data.syncFrom) return 'unknown';
    
    const drift = Math.abs(data.syncFrom - data.syncTo);
    
    if (drift < 2) return 'synced';
    if (drift < 10) return 'good';
    if (drift < 60) return 'fair';
    return 'poor';
  }
  
  shouldSkipUpdate(gatewayEui) {
    const lastUpdate = this.lastStatusUpdate.get(gatewayEui);
    if (!lastUpdate) return false;
    
    const timeSinceLast = Date.now() - lastUpdate;
    return timeSinceLast < this.minUpdateInterval;
  }
  
  logStatusSummary(gatewayEui, status) {
    const battery = status.battery;
    const signal = status.signal;
    const temp = status.temperature;
    
    console.log('📋 Status Summary:');
    console.log(`   Gateway: ${gatewayEui}`);
    console.log(`   Battery: ${battery.voltage}mV (${battery.level})`);
    console.log(`   Temp: ${temp.celsius}°C`);
    console.log(`   Signal: ${signal.strength} (RSRP: ${signal.rsrp})`);
    console.log(`   Connected: ${status.network.connected ? '✅' : '❌'}`);
    console.log(`   Collecting: ${status.collection.active ? '✅' : '⏸️'}`);
    console.log(`   Telegrams: ${status.collection.telegrams_collected}`);
  }
  
  async storeStatus(gatewayEui, status) {
    try {
      
      const alerts = await this.checkAlerts(gatewayEui, status);

      await databaseService.insertGatewayStatus(
        gatewayEui, //gateway_eui
        status.received_at, //timestamp
        status.time_sync.sync_from, //sync-from
        status.time_sync.sync_to, //sync-to
        status.time_sync.sync_ticks, //sync-time
        status.network.parsed_monitor,//monitor
        status.signal.cell_id,//ci
        status.signal.tac,//tac
        status.signal.rsrp, // rsrp
        status.signal.snr,//snt
        status.signal.operator, //operator
        status.signal.band, //band
        status.network.apn, //apn
        status.battery.voltage, //vbat 
        +status.temperature.celsius,  //temperature
        !status.collection.active, //Collected
        status.collection.telegrams_collected, //telegram count
        status.collection.telegrams_uploading //uploading_count
      )
      
      console.log('✅ Status stored in database');
      
    } catch (error) {
      console.error('Failed to store status:', error.message);
      // Don't throw - we don't want status failures to crash the service
    }
  }
  
  async checkAlerts(gatewayEui, status) {
    const alerts = [];
    
    // Check battery
    if (status.battery.voltage < this.thresholds.battery.critical) {
      alerts.push({
        type: 'battery_critical',
        severity: 'critical',
        message: `Battery critically low: ${status.battery.voltage}mV`,
        data: {
          voltage: status.battery.voltage,
          level: status.battery.level
        }
      });
    } else if (status.battery.voltage < this.thresholds.battery.warning) {
      alerts.push({
        type: 'battery_low',
        severity: 'warning',
        message: `Battery low: ${status.battery.voltage}mV`,
        data: {
          voltage: status.battery.voltage,
          level: status.battery.level
        }
      });
    }
    
    // Check temperature
    if (status.temperature.raw > this.thresholds.temperature.high) {
      alerts.push({
        type: 'temperature_high',
        severity: 'warning',
        message: `Temperature high: ${status.temperature.celsius}°C`,
        data: {
          celsius: status.temperature.celsius,
          raw: status.temperature.raw
        }
      });
    } else if (status.temperature.raw < this.thresholds.temperature.low) {
      alerts.push({
        type: 'temperature_low',
        severity: 'warning',
        message: `Temperature low: ${status.temperature.celsius}°C`,
        data: {
          celsius: status.temperature.celsius,
          raw: status.temperature.raw
        }
      });
    }
    
    // Check signal
    if (status.signal.rsrp > this.thresholds.signal.poor) {
      alerts.push({
        type: 'signal_poor',
        severity: 'warning',
        message: `Poor signal: RSRP=${status.signal.rsrp}`,
        data: {
          rsrp: status.signal.rsrp,
          strength: status.signal.strength
        }
      });
    }
    
    // Check connectivity
    if (!status.network.connected) {
      alerts.push({
        type: 'disconnected',
        severity: 'critical',
        message: 'Gateway not connected to network',
        data: {
          monitor_string: status.network.monitor_string
        }
      });
    }
    
    // Check time sync
    if (status.time_sync.sync_status === 'poor') {
      alerts.push({
        type: 'time_sync_poor',
        severity: 'warning',
        message: 'Poor time synchronization',
        data: {
          sync_status: status.time_sync.sync_status,
          sync_to: status.time_sync.sync_to,
          sync_from: status.time_sync.sync_from
        }
      });
    }
    
    // If we have alerts, log them
    if (alerts.length > 0) {
      console.warn(`🚨 ${alerts.length} alerts for ${gatewayEui}:`);
      alerts.forEach(alert => {
        console.warn(`   ${alert.severity.toUpperCase()}: ${alert.message}`);
      });
      
      // Store alerts in database
      await this.storeAlerts(gatewayEui, alerts);
    }
    
    return alerts;
  }
  
  async storeAlerts(gatewayEui, alerts) {
    try {
      const insertPromises = alerts.map(alert => {        
        return databaseService.insertGatewayAlert(
          gatewayEui,
          alert.type,
          alert.severity,
          alert.message,
          JSON.stringify(alert.data),
          new Date().toISOString()
        );
      });
      
      await Promise.all(insertPromises);
      console.log(`📝 ${alerts.length} alerts stored in database`);
      
    } catch (error) {
      console.error('Failed to store alerts:', error.message);
    }
  }
  
  // Helper to get status history
  async getStatusHistory(gatewayEui, limit = 10) {
    try {
      const query = `
        SELECT * FROM gateway_status 
        WHERE gateway_eui = $1 
        ORDER BY timestamp DESC 
        LIMIT $2
      `;
      
      const result = await databaseService.query(query, [gatewayEui, limit]);
      return result.rows;
      
    } catch (error) {
      console.error('Failed to get status history:', error.message);
      return [];
    }
  }
  
  // Helper to get current status
  async getCurrentStatus(gatewayEui) {
    try {
      const query = `
        SELECT * FROM gateway_status 
        WHERE gateway_eui = $1 
        ORDER BY timestamp DESC 
        LIMIT 1
      `;
      
      const result = await databaseService.query(query, [gatewayEui]);
      return result.rows[0] || null;
      
    } catch (error) {
      console.error('Failed to get current status:', error.message);
      return null;
    }
  }
}

const statusHandler = new StatusHandler();
export default statusHandler;