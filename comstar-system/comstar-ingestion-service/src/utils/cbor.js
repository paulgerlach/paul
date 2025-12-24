import cbor from 'cbor';

/**
 * Simple CBOR utility for ComStar ingestion service
 * Handles encoding/decoding with proper error handling
 */

class CborUtils {
  constructor() {
    this.debug = process.env.NODE_ENV === 'development';
  }

  /**
   * Decode CBOR message from gateway
   * @param {Buffer|Uint8Array} data - Raw CBOR data
   * @returns {Promise<Object>} Decoded message
   */
  async decode(data) {
    try {
      // Try to decode as CBOR
      const decoded = await cbor.decodeFirst(data);
      
      if (this.debug) {
        console.log('✅ CBOR decoded successfully');
        console.log('Decoded:', this.safeStringify(decoded));
      }
      
      return decoded;
      
    } catch (cborError) {
      // If CBOR fails, try JSON (gateway might send JSON for debugging)
      try {
        const jsonString = data.toString('utf8');
        const jsonData = JSON.parse(jsonString);
        
        console.log('⚠️  CBOR decode failed, using JSON fallback');
        return jsonData;
        
      } catch (jsonError) {
        // Neither CBOR nor JSON worked
        console.error('❌ Failed to decode as CBOR or JSON');
        console.error('Raw data (hex):', data.toString('hex').substring(0, 100) + '...');
        console.error('Raw data (string):', data.toString('utf8').substring(0, 100) + '...');
        
        throw new Error(`Decode failed: ${cborError.message}, ${jsonError.message}`);
      }
    }
  }

  /**
   * Encode object to CBOR for downlink responses
   * @param {Object} data - Data to encode
   * @returns {Promise<Buffer>} CBOR encoded buffer
   */
  async encode(data) {
    try {
      const encoded = await cbor.encodeAsync(data);
      
      if (this.debug) {
        console.log('✅ CBOR encoded successfully');
        console.log('Original:', this.safeStringify(data));
        console.log('Encoded size:', encoded.length, 'bytes');
      }
      
      return encoded;
      
    } catch (error) {
      console.error('❌ CBOR encode failed:', error.message);
      console.error('Data:', this.safeStringify(data));
      
      // Fallback to JSON for debugging
      if (this.debug) {
        const jsonString = JSON.stringify(data);
        console.log('JSON fallback:', jsonString.substring(0, 200) + '...');
        return Buffer.from(jsonString);
      }
      
      throw error;
    }
  }

  /**
   * Validate CBOR message structure
   * @param {Object} message - Decoded message
   * @returns {boolean} True if valid
   */
  validateMessage(message) {
    // Required fields for ComStar uplinks
    const required = ['i', 'n', 'q', 'd'];
    const missing = required.filter(field => !(field in message));
    
    if (missing.length > 0) {
      console.error(`Missing required fields: ${missing.join(', ')}`);
      return false;
    }
    
    // Validate field types
    const validations = {
      'i': typeof message.i === 'string',
      'n': Number.isInteger(message.n),
      'q': typeof message.q === 'string',
      'd': message.d !== null && message.d !== undefined
    };
    
    const invalid = Object.entries(validations)
      .filter(([field, isValid]) => !isValid)
      .map(([field]) => field);
    
    if (invalid.length > 0) {
      console.error(`Invalid field types: ${invalid.join(', ')}`);
      return false;
    }
    
    return true;
  }

  /**
   * Extract and validate message from topic and payload
   * @param {string} topic - MQTT topic
   * @param {Buffer} payload - CBOR payload
   * @returns {Promise<{gatewayEui: string, messageType: string, data: Object}>}
   */
  async extractMessage(topic, payload) {
    try {
      // Parse topic: LOB/{devEui}/{direction}/{messageType}
      const parts = topic.split('/');
      if (parts.length < 4) {
        throw new Error(`Invalid topic format: ${topic}`);
      }
      
      const gatewayEui = parts[1];
      const direction = parts[2]; // 'up' or 'req'
      const messageType = parts[3];
      
      // Decode payload
      const decoded = await this.decode(payload);
      
      // Validate structure
      if (!this.validateMessage(decoded)) {
        throw new Error('Invalid message structure');
      }
      
      // Verify gateway EUI matches topic
      if (decoded.i.toLowerCase() !== gatewayEui.toLowerCase()) {
        console.warn(`⚠️  EUI mismatch: topic ${gatewayEui} != payload ${decoded.i}`);
        // Continue anyway - some gateways might have different formatting
      }
      
      return {
        gatewayEui,
        direction,
        messageType,
        queryType: decoded.q,
        messageNumber: decoded.n,
        data: decoded.d,
        raw: decoded
      };
      
    } catch (error) {
      console.error('Failed to extract message:', error.message);
      throw error;
    }
  }

  /**
   * Create downlink response envelope
   * @param {number} downlinkNumber - Sequence number for downlink
   * @param {number} requestNumber - Reference to request message number
   * @param {Object} data - Response data
   * @returns {Object} Formatted downlink message
   */
  createDownlink(downlinkNumber, requestNumber, data) {
    return {
      n: downlinkNumber,
      r: requestNumber,
      d: data
    };
  }

  /**
   * Create uplink envelope (for testing/mocking)
   * @param {string} gatewayEui - Gateway EUI
   * @param {number} messageNumber - Sequence number
   * @param {string} queryType - Message type ('device', 'config', 'data', etc.)
   * @param {Object} data - Payload data
   * @returns {Object} Formatted uplink message
   */
  createUplink(gatewayEui, messageNumber, queryType, data) {
    return {
      i: gatewayEui,
      n: messageNumber,
      q: queryType,
      d: data
    };
  }

  /**
   * Safe stringify for logging (handles circular references)
   * @param {any} obj - Object to stringify
   * @param {number} maxLength - Maximum length to return
   * @returns {string} Safe string representation
   */
  safeStringify(obj, maxLength = 500) {
    try {
      let str = JSON.stringify(obj, this.getCircularReplacer());
      if (str.length > maxLength) {
        str = str.substring(0, maxLength) + '...';
      }
      return str;
    } catch (error) {
      return `[Stringify error: ${error.message}]`;
    }
  }

  /**
   * JSON.stringify replacer to handle circular references
   */
  getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      
      // Handle Buffer objects
      if (value && value.type === 'Buffer' && Array.isArray(value.data)) {
        return `<Buffer: ${value.data.length} bytes>`;
      }
      
      // Handle binary data
      if (value instanceof Uint8Array || value instanceof Buffer) {
        return `<Binary: ${value.length} bytes>`;
      }
      
      return value;
    };
  }

  /**
   * Convert hex string to Buffer
   * @param {string} hex - Hex string
   * @returns {Buffer} Buffer
   */
  hexToBuffer(hex) {
    return Buffer.from(hex, 'hex');
  }

  /**
   * Convert Buffer to hex string
   * @param {Buffer} buffer - Buffer
   * @returns {string} Hex string
   */
  bufferToHex(buffer) {
    return buffer.toString('hex');
  }

  /**
   * Test CBOR round-trip
   * @param {Object} data - Test data
   * @returns {Promise<boolean>} True if round-trip successful
   */
  async testRoundTrip(data) {
    try {
      console.log('Testing CBOR round-trip...');
      console.log('Original:', this.safeStringify(data));
      
      const encoded = await this.encode(data);
      console.log('Encoded:', this.bufferToHex(encoded).substring(0, 100) + '...');
      
      const decoded = await this.decode(encoded);
      console.log('Decoded:', this.safeStringify(decoded));
      
      const success = JSON.stringify(data) === JSON.stringify(decoded);
      console.log(success ? '✅ Round-trip successful' : '❌ Round-trip failed');
      
      return success;
    } catch (error) {
      console.error('Round-trip test failed:', error.message);
      return false;
    }
  }
}

// Singleton instance
const cborUtils = new CborUtils();
export default cborUtils;