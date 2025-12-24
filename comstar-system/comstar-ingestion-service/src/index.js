class IngestionService { 
  constructor() {
    console.log("Si online")
    // this.mqttHandler = new MqttHandler();
  }
}


// Start the service
if (import.meta.url === 'file://'+ process.argv[1]) {
  const service = new IngestionService();
  // service.start().catch(error => {
  //   logger.fatal({ error }, 'Service failed to start');
  //   process.exit(1);
  // });
  
  // // Export for testing
  // global.ingestionService = service;
}

export { IngestionService };