import config from './config/environment.js'
import mqtt from 'mqtt';
import syncHandler from './handlers/sync.js'
import deviceHandler from './handlers/deviceHandler.js'
import cbor from './utils/cbor.js';

class MqttHandler { 
  constructor() { 
    this.config = config.mqtt;
    this.client = null;
    this.isConnected = false;
    //Add response tracking
    // Handler registry
    this.handlers = {
      // 🚨 URGENT HANDLERS (<5s response required!)
      'sync': {
        handler: syncHandler,
        isUrgent: true,
        responseTopic: (gatewayEui) => `LOB/${gatewayEui}/down/sync`
      },
      
      // Data handlers (no response needed)
      'device': {
        handler: deviceHandler,
        isUrgent: false
      },
    }
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
      this.client.on('message', (topic, message) => this.onMessage(topic, message));
      this.client.on('error', (err) => this.onError(err, reject));
      this.client.on('close', () => this.onClose());
      this.client.on('reconnect', () => this.onReconnect());

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

  onError(err, reject) {
    console.error({ err }, 'MQTT error');
    if (reject && !this.isConnected) {
      reject(err);
    }
  }
  
  onClose() {
    this.isConnected = false;
    console.warn('Disconnected from MQTT broker');
  }
  
  onReconnect() {
    console.log('Reconnecting to MQTT broker...');
  }


  async onMessage(topic, message) {
    const startTime = Date.now();
    try {
      // Extract gateway EUI and message type from topic
      const { gatewayEui, messageType, direction } = this.parseTopic(topic);
      
      if (!gatewayEui || !messageType) {
        console.error({ topic }, 'Could not parse topic');
        return;
      }
      
      // Decode message
      const decoded = await cbor.decode(message);
      const { n: messageNumber, q: queryType, d: data } = decoded;
      
      console.log({
        gatewayEui,
        messageType,
        direction,
        messageNumber,
        queryType,
        topic
      }, 'Received MQTT message');

      console.log('DATA', data);
      
    
    } catch (error) {
      console.error({ error, topic, message: message.toString('hex').substring(0, 100) }, 'Message processing error');
      
      // Still need to respond to urgent requests even on error
      if (error.gatewayEui && error.queryType && error.messageNumber) {
        await this.sendErrorResponse(error.gatewayEui, error.queryType, error.messageNumber, error);
      }
    }
  }


  async sendErrorResponse(gatewayEui, queryType, requestMessageNumber, error) {
    const responseTopic = `LOB/${gatewayEui}/down/${queryType}`;
    const errorResponse = {
      n: this.getNextDownlinkNumber(),
      r: requestMessageNumber,
      d: {
        error: error.message.substring(0, 100),
        timestamp: Date.now()
      }
    };
    
    try {
      const encoded = await cbor.encode(errorResponse);
      this.client.publish(responseTopic, encoded, {
        qos: this.config.publishQos,
        retain: true
      });
      
      logger.warn({ gatewayEui, queryType, error: error.message }, 'Error response sent');
    } catch (encodeError) {
      logger.error({ encodeError }, 'Failed to send error response');
    }
  }


  parseTopic(topic) {
    // LOB/{devEui}/{direction}/{messageType}
    const parts = topic.split('/');
    
    if (parts.length < 4) {
      return {};
    }
    
    return {
      gatewayEui: parts[1],
      direction: parts[2], // 'up' or 'req'
      messageType: parts[3]
    };
  }
  

  getStats() {
    return {
      connected: this.isConnected,
      responseStats: 0 //this.responseTracker.getStats()
    };
  }

}

export default MqttHandler;