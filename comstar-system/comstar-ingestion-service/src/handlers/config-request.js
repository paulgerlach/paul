import logger from '../utils/logger.js';
import databaseService from '../services/database.js';

class ConfigRequestHandler {
  constructor() {
    this.name = 'config-request';
    this.isUrgent = true; // 🚨 MUST respond within 5 seconds!
    
    // Cache configurations to avoid DB hits
    this.configCache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
  }
  
  async handle({ gatewayEui, data, messageNumber }) {
    const startTime = Date.now();
    
    logger.info({
      gatewayEui,
      etag: data.etag,
      messageNumber
    }, '🚨 Processing config request');
    
    try {
      // Validate request
      if (!data.etag || typeof data.etag !== 'string') {
        throw new Error('Missing or invalid etag in request');
      }
      
      // Get configuration for this etag
      const config = await this.getConfiguration(gatewayEui, data.etag);
      
      // Build response (ComStar spec allows partial config)
      const response = {
        etag: data.etag,
        config: config
      };
      
      const elapsed = Date.now() - startTime;
      
      logger.info({
        gatewayEui,
        etag: data.etag,
        configKeys: Object.keys(config),
        elapsed
      }, '✅ Config response prepared');
      
      // Warn if slow
      if (elapsed > 4000) {
        logger.warn({
          gatewayEui,
          elapsed
        }, '⚠️ Config response taking too long!');
      }
      
      return response;
      
    } catch (error) {
      const elapsed = Date.now() - startTime;
      
      logger.error({
        gatewayEui,
        error: error.message,
        elapsed,
        requestedEtag: data.etag
      }, '❌ Config request failed');
      
      // Still respond with empty config (gateway will keep current config)
      return {
        etag: data.etag,
        config: {}
      };
    }
  }
  
  async getConfiguration(gatewayEui, requestedEtag) {
    // Check cache first
    const cacheKey = `${gatewayEui}-${requestedEtag}`;
    const cached = this.configCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      logger.debug({ gatewayEui, cacheKey }, 'Using cached config');
      return cached.config;
    }
    
    logger.debug({ gatewayEui, requestedEtag }, 'Fetching config from database');
    
    try {
      // Step 1: Get base configuration for this etag
      const baseConfig = await this.getBaseConfiguration(requestedEtag);
      
      if (!baseConfig) {
        throw new Error(`Configuration not found for etag: ${requestedEtag}`);
      }
      
      // Step 2: Get gateway-specific overrides
      const overrides = await this.getGatewayOverrides(gatewayEui);
      
      // Step 3: Merge base config with overrides
      const mergedConfig = this.mergeConfigurations(baseConfig, overrides);
      
      // Step 4: Validate configuration
      this.validateConfiguration(mergedConfig);
      
      // Cache the result
      this.configCache.set(cacheKey, {
        config: mergedConfig,
        timestamp: Date.now()
      });
      
      // Clean old cache entries
      this.cleanCache();
      
      return mergedConfig;
      
    } catch (error) {
      logger.error({
        gatewayEui,
        requestedEtag,
        error: error.message
      }, 'Failed to get configuration');
      
      // Return minimal configuration to keep gateway running
      return this.getFallbackConfig(gatewayEui);
    }
  }
  
  async getBaseConfiguration(etag) {
    // Fetch from config_versions table
    const query = `
      SELECT config 
      FROM config_versions 
      WHERE etag = $1
    `;
    
    const result = await databaseService.query(query, [etag]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Config is stored as JSONB in database
    return result.rows[0].config;
  }
  
  async getGatewayOverrides(gatewayEui) {
    // Fetch gateway-specific overrides
    const query = `
      SELECT config_key, config_value 
      FROM gateway_config_overrides 
      WHERE gateway_eui = $1
    `;
    
    const result = await databaseService.query(query, [gatewayEui]);
    
    // Convert array of key-value pairs to object
    const overrides = {};
    result.rows.forEach(row => {
      overrides[row.config_key] = this.parseConfigValue(row.config_value);
    });
    
    return overrides;
  }
  
  parseConfigValue(value) {
    // Parse configuration values from string to appropriate type
    if (value === null || value === undefined) {
      return value;
    }
    
    // Boolean
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    
    // Number
    if (/^-?\d+$/.test(value)) return parseInt(value, 10);
    if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value);
    
    // Array (comma-separated list)
    if (value.includes(',')) {
      return value.split(',').map(item => item.trim());
    }
    
    // Default: string
    return value;
  }
  
  mergeConfigurations(baseConfig, overrides) {
    // Start with base config
    const merged = { ...baseConfig };
    
    // Apply overrides
    Object.keys(overrides).forEach(key => {
      if (overrides[key] === null) {
        // Null means delete this key
        delete merged[key];
      } else {
        merged[key] = overrides[key];
      }
    });
    
    return merged;
  }
  
  validateConfiguration(config) {
    const requiredFields = ['Host'];
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required config fields: ${missingFields.join(', ')}`);
    }
    
    // Validate Host URL format
    if (config.Host && !this.isValidMqttUrl(config.Host)) {
      throw new Error(`Invalid MQTT host URL: ${config.Host}`);
    }
    
    // Validate cron expression if present
    if (config.listenCron && !this.isValidCron(config.listenCron)) {
      throw new Error(`Invalid cron expression: ${config.listenCron}`);
    }
    
    // Validate numeric ranges
    if (config.maxTelegrams !== undefined) {
      const max = parseInt(config.maxTelegrams);
      if (isNaN(max) || max < 0 || max > 2500) {
        throw new Error(`maxTelegrams must be 0-2500, got: ${config.maxTelegrams}`);
      }
    }
    
    if (config.RndDelay !== undefined) {
      const delay = parseInt(config.RndDelay);
      if (isNaN(delay) || delay < 0 || delay > 36000) {
        throw new Error(`RndDelay must be 0-36000, got: ${config.RndDelay}`);
      }
    }
    
    return true;
  }
  
  isValidMqttUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'mqtt:' || parsed.protocol === 'mqtts:' || parsed.protocol === 'ws:' || parsed.protocol === 'wss:';
    } catch {
      return false;
    }
  }
  
  isValidCron(cron) {
    // Basic cron validation (simplified)
    const cronParts = cron.split(' ');
    return cronParts.length >= 5 && cronParts.length <= 6;
  }
  
  getFallbackConfig(gatewayEui) {
    // Minimal configuration to keep gateway operational
    return {
      Host: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
      UseLtem: true,
      listenCron: 'H 0 0,12 * * *', // Noon and midnight
      maxTelegrams: 100,
      RndDelay: 300
    };
  }
  
  cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.configCache.entries()) {
      if (now - value.timestamp > this.cacheTTL) {
        this.configCache.delete(key);
      }
    }
  }
  
  // Admin functions
  
  async createConfiguration(config, description = '', createdBy = 'system') {
    // Generate etag from config content
    const etag = this.generateEtag(config);
    
    const query = `
      INSERT INTO config_versions (etag, config, description, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING etag
    `;
    
    const result = await databaseService.query(query, [
      etag,
      JSON.stringify(config),
      description,
      createdBy
    ]);
    
    logger.info({
      etag,
      configKeys: Object.keys(config),
      description
    }, 'New configuration created');
    
    return result.rows[0].etag;
  }
  
  generateEtag(config) {
    // Create deterministic hash of configuration
    const configString = JSON.stringify(config, Object.keys(config).sort());
    
    // Simple hash - in production use crypto.createHash('sha256')
    let hash = 0;
    for (let i = 0; i < configString.length; i++) {
      hash = ((hash << 5) - hash) + configString.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
  
  async assignConfiguration(gatewayEui, etag) {
    // Update gateway's desired state with new config etag
    const query = `
      INSERT INTO gateway_desired_state (gateway_eui, desired_config_etag)
      VALUES ($1, $2)
      ON CONFLICT (gateway_eui) 
      DO UPDATE SET 
        desired_config_etag = EXCLUDED.desired_config_etag,
        updated_at = NOW()
      RETURNING gateway_eui
    `;
    
    const result = await databaseService.query(query, [gatewayEui, etag]);
    
    // Clear cache for this gateway
    this.clearGatewayCache(gatewayEui);
    
    logger.info({
      gatewayEui,
      etag
    }, 'Configuration assigned to gateway');
    
    return result.rows[0];
  }
  
  async setGatewayOverride(gatewayEui, key, value) {
    const query = `
      INSERT INTO gateway_config_overrides (gateway_eui, config_key, config_value)
      VALUES ($1, $2, $3)
      ON CONFLICT (gateway_eui, config_key) 
      DO UPDATE SET config_value = EXCLUDED.config_value
      RETURNING id
    `;
    
    await databaseService.query(query, [gatewayEui, key, String(value)]);
    
    // Clear cache for this gateway
    this.clearGatewayCache(gatewayEui);
    
    logger.info({
      gatewayEui,
      key,
      value
    }, 'Gateway config override set');
  }
  
  clearGatewayCache(gatewayEui) {
    // Remove all cached configs for this gateway
    for (const key of this.configCache.keys()) {
      if (key.startsWith(`${gatewayEui}-`)) {
        this.configCache.delete(key);
      }
    }
  }
}

const configRequestHandler = new ConfigRequestHandler();
export default configRequestHandler;