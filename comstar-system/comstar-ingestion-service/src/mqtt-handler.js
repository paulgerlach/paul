import config from './config/environment.js'
import mqtt from 'mqtt';

class MqttHandler { 
  constructor() { 
    this.config = config.mqtt;
    console.log('Config', this.config);
  }


  async connect() { 
    return new Promise((resolve, reject) => { 
      console.log(`Connecting to MQTT broker: ${this.config.brokerUrl}`);

      const options = {
        clientId: this.config.clientId,
        username: this.config.username,
        password: this.config.password,
        clean: this.config.cleanSession,
        keepalive: this.config.keepalive,
        reconnectPeriod: this.config.reconnectPeriod,
        connectTimeout: 10000,
        
        // Last Will
        will: {
          topic: 'ingestion/status',
          payload: JSON.stringify({ status: 'offline', timestamp: Date.now() }),
          qos: 1,
          retain: true
        }
      };

      this.client = mqtt.connect(this.config.brokerUrl, options);

      this.client.on('connect', () => this.onConnect(resolve));

      // Connection timeout
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error('MQTT connection timeout'));
        }
      }, 15000);
    });
  }

  onConnect(resolve) {
    this.isConnected = true;
    console.log('✅ Connected to MQTT broker');
    
    // Subscribe to topics
    this.client.subscribe(this.config.topics, { qos: this.config.subscribeQos }, (err) => {
      if (err) {
        console.error({ err }, 'Subscription error');
        return;
      }
      
      console.log(`Subscribed to topics: ${this.config.topics.join(', ')}`);
      
      // Publish online status
      this.client.publish('ingestion/status', JSON.stringify({
        status: 'online',
        timestamp: Date.now(),
        version: '1.0.0'
      }), { qos: 1, retain: true });
      
      resolve();
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      console.log('MQTT client disconnected');
    }
  }

}

export default MqttHandler;