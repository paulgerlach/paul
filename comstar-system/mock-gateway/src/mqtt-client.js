import mqtt from 'mqtt';

export class MqttClient {
  constructor(config) { 
    this.config = config;
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
        
      console.log(`🚀[${this.config.name}] Connected to ${this.config.brokerUrl}...`);
      
      // Event handlers
      // this.client.on('connect', () => this.onConnect(resolve));
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
}