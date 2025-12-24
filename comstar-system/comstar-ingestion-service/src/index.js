import config from './config/environment.js';

class IngestionService { 
  constructor() {
    // this.mqttHandler = new MqttHandler();
  }

  async start() {
    console.log('🚀 Starting ComStar Ingestion Service');
    console.log({
      broker: config.mqtt.brokerUrl,
      nodeEnv: process.env.NODE_ENV,
      performance: config.performance
    }, 'Service configuration');
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