import config from './config/environment.js';
import MqttHandler from './mqtt-handler.js';

class IngestionService { 
  constructor() {
    this.mqttHandler = new MqttHandler();
    this.stats = {
      startTime: null,
      messagesProcessed: 0,
      errors: 0
    };
  }

  async start() {
    console.log('🚀 Starting ComStar Ingestion Service');
    console.log({
      broker: config.mqtt.brokerUrl,
      nodeEnv: process.env.NODE_ENV,
      performance: config.performance
    }, 'Service configuration');
    
    this.stats.startTime = new Date();

    console.log('START TIME : ', this.stats.startTime)

    try {
      await this.mqttHandler.connect();

    } catch (error) {
      console.error({ error }, '❌ Failed to start ingestion service');
      process.exit(1);
    }

  }

}


// Start the service
if (import.meta.url === 'file://'+ process.argv[1]) {
  const service = new IngestionService();
  service.start().catch(error => {
    console.error({ error }, 'Service failed to start');
    process.exit(1);
  });
  
  // // Export for testing
  global.ingestionService = service;
}

export { IngestionService };