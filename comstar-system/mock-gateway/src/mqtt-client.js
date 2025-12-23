import mqtt from 'mqtt';

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
      // this.client.on('message', (topic, message) => this.onMessage(topic, message));
      // this.client.on('error', (err) => this.onError(err, reject));
      // this.client.on('close', () => this.onClose());
      // this.client.on('offline', () => this.onOffline());
      // this.client.on('reconnect', () => this.onReconnect());
      
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
}