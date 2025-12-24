import mqtt from 'mqtt';
import cbor from 'cbor';

export class MqttClient {
  constructor(config) { 
    this.config = config;
    this.client = null;
    this.isConnected = false;
    this.messageQueue = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    
    // Statistics
    this.stats = {
      uplinksSent: 0,
      downlinksReceived: 0,
      connectionTime: null,
      lastMessageTime: null
    };
    console.log('MqttClient')
    console.log(`🎯 Mock ComStar Gateway: ${this.config.name}`);
    console.log(`   DevEUI: ${this.config.devEui}`);
    console.log(`   Broker: ${this.config.brokerUrl}`);
    console.log(`   Schedule: ${this.config.listenCron}`)
  }


  async connect() { 
    try {
      return new Promise((resolve, reject) => {
      console.log(`[${this.config.name}] Connecting to ${this.config.brokerUrl}...`);
      
      const options = {
        clientId: this.config.devEui,
        username: this.config.username,
        password: this.config.password,
        clean: false,            // CRITICAL: Must match real gateway
        keepalive: 60,           // 60 seconds like real gateway
        reconnectPeriod: 5000,   // 5 seconds between reconnects
        connectTimeout: 10000,   // 10 second connection timeout
        
        // Last Will & Testament - from device config
        will: {
          topic: `LOB/${this.config.devEui}/status`,
          payload: JSON.stringify({ 
            status: 'offline', 
            timestamp: Date.now(),
            reason: 'connection_lost'
          }),
          qos: 1,
          retain: true
        }
      };
      
      this.client = mqtt.connect(this.config.brokerUrl, options);
      
      // Event handlers
      this.client.on('connect', () => this.onConnect(resolve));
      this.client.on('message', (topic, message) => this.onMessage(topic, message));
      this.client.on('error', (err) => this.onError(err, reject));
      this.client.on('close', () => this.onClose());
      this.client.on('offline', () => this.onOffline());
      this.client.on('reconnect', () => this.onReconnect());
      
      // Set connection timeout
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error('Connection timeout'));
        }
      }, 15000);
    });
    } catch (error) {
      console.error(`❌ Failed to connect to broker:`, error.message);
      process.exit(1);
    }
  }

  onConnect(resolve) {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.stats.connectionTime = new Date();
    
    console.log(`[${this.config.name}] ✅ Connected to MQTT broker`);
    
    // Subscribe to downlink topics
    this.subscribeToDownlinks();

    // Process queued messages
    this.processMessageQueue();

    resolve(this);
  }

  
  onOffline() {
    console.log(`[${this.config.name}] ⚠️ Broker connection lost`);
  }
  
  onError(err, reject) {
    console.error(`[${this.config.name}] ❌ MQTT error:`, err.message);
    if (reject && !this.isConnected) {
      reject(err);
    }
  }


  // Event emitter simulation
  eventListeners = {};
  
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  async onMessage(topic, message) {
    this.stats.downlinksReceived++;
    this.stats.lastMessageTime = new Date();
    
    console.log(`[${this.config.name}] 📥 Received downlink on ${topic}`);


    try {
      // Try to decode as CBOR first
      let decoded;
      try {
        decoded = await cbor.decodeFirst(message);
        console.log('Decoded ==>> ', decoded);
      } catch (cborError) {
        // Fall back to JSON
        decoded = JSON.parse(message.toString());
      }

      // Emit event for gateway to handle
      this.emit('downlink', {
        topic,
        message: decoded,
        raw: message
      });

      // Log the downlink
      this.logDownlink(topic, decoded);      

    } catch (error) {
      console.error(`[${this.config.name}] ❌ Failed to process downlink:`, error.message);
      console.log('Raw message:', message.toString('hex').substring(0, 100) + '...');
    }
  }

  async publish(topic, data, options = {}) {
    const fullTopic = `LOB/${this.config.devEui}/${topic}`;
    

    // Default options
    const publishOptions = {
      qos: 1,
      retain: false,
      ...options
    };

    // Create message envelope
    const envelope = {
      i: this.config.devEui,
      n: this.getNextMessageNumber(),
      q: topic.split('/').pop(),
      d: data
    };

    try {
      // Encode as CBOR (like real gateway)
      const encoded = await cbor.encodeAsync(envelope);
      console.log('Encoded envelope : ', encoded)

    } catch (error) {
      console.error(`[${this.config.name}] ❌ Encoding error:`, error.message);
    }
}

  onReconnect() {
    this.reconnectAttempts++;
    console.log(`[${this.config.name}] 🔄 Reconnecting (attempt ${this.reconnectAttempts})...`);
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`[${this.config.name}] ❌ Max reconnection attempts reached`);
      this.client.end();
    }
  }

  onClose() {
    this.isConnected = false;
    console.log(`[${this.config.name}] 🔌 Disconnected from broker`);
  }


  subscribeToDownlinks() {
    const topics = [
      `LOB/${this.config.devEui}/down/+`,
      `LOB/${this.config.devEui}/down/#`
    ];

    console.log(`BROKER TOPICS [${topics}] `);
    this.client.subscribe(topics, { qos: 1 }, (err) => {
      if (err) {
        console.error(`[${this.config.name}] ❌ Subscription error:`, err.message);
      } else {
        console.log(`[${this.config.name}] ✅ Subscribed to downlink topics`);
      }
    });
  }


  processMessageQueue() {
    if (!this.isConnected) {
      console.log(`[${this.config.name}] Not connected`);
      return
    };

    if (this.messageQueue.length === 0) {
      console.log(`[${this.config.name}] Did not Process ${this.messageQueue.length} queued messages: No Messages`);
      return
    };
    
    console.log(`[${this.config.name}] Processing ${this.messageQueue.length} queued messages...`);
    
    const queueCopy = [...this.messageQueue];
    this.messageQueue = [];
    
    queueCopy.forEach(async (msg) => {
      try {
        await this.publish(msg.topic, msg.data, msg.options);
      } catch (error) {
        console.error(`[${this.config.name}] ❌ Failed to send queued message:`, error.message);
        // Requeue if it's a connection error
        if (error.message.includes('Not connected')) {
          this.messageQueue.push(msg);
        }
      }
    });
  }

  
  emit(event, data) {
    const listeners = this.eventListeners[event] || [];
    listeners.forEach(callback => callback(data));
  }

  logDownlink(topic, message) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      gateway: this.config.name,
      topic,
      message: this.sanitizeMessage(message),
      stats: { ...this.stats }
    };
    
    // Log to console
    console.log(JSON.stringify(logEntry, null, 2));
    
    // Could also write to file or database
    if (process.env.LOG_DOWNLINKS === 'true') {
      this.writeToLogFile(logEntry);
    }
  }

  sanitizeMessage(message) {
    // Remove large binary data for logging
    const sanitized = { ...message };
    
    if (sanitized.d && sanitized.d.d && Buffer.isBuffer(sanitized.d.d)) {
      sanitized.d.d = `<binary: ${sanitized.d.d.length} bytes>`;
    }
    
    return sanitized;
  }

  writeToLogFile(entry) {
    const fs = require('fs').promises;
    const logFile = `logs/downlinks-${this.config.devEui}.log`;
    
    fs.appendFile(logFile, JSON.stringify(entry) + '\n').catch(console.error);
  }

  getNextMessageNumber() {
    // Start at 1 after "boot", increment for each message
    if (!this.messageNumber) {
      this.messageNumber = 1;
    }
    return this.messageNumber++;
  }
}