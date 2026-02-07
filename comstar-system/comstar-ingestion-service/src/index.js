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

      // Setup graceful shutdown
      this.setupShutdownHandlers();
      
      // Start health monitoring
      this.startHealthMonitoring();

      // Start stats logging
      this.startStatsLogging();
      
    } catch (error) {
      console.error({ error }, '❌ Failed to start ingestion service');
      throw { error }, '❌ Failed to start ingestion service';
    }
  }

   setupShutdownHandlers() {
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    
    signals.forEach(signal => {
      process.on(signal, async () => {
        if (this.shuttingDown) return;
        
        this.shuttingDown = true;
        console.log(`Received ${signal}, shutting down gracefully...`);
        
        // Give some time for in-flight messages
        await this.delay(2000);
        
        // Disconnect from MQTT
        this.mqttHandler.disconnect();
        
        console.log('✅ Ingestion service shutdown complete');
        process.exit(0);
      });
    });
    
    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.error({ error }, 'Uncaught exception');
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error({ reason, promise }, 'Unhandled promise rejection');
    });
   }
  
  startHealthMonitoring() {
    // Monitor response times
    setInterval(() => {
      const stats = this.mqttHandler.getStats();
      
      if (stats.responseStats.slowResponses > 0) {
        console.error({
          slowResponses: stats.responseStats.slowResponses,
          avgDuration: stats.responseStats.averageDuration.toFixed(2)
        }, 'Slow responses detected');
      }
    }, 30000); // Every 30 seconds
  }

  startStatsLogging() {
    setInterval(() => {
      const uptime = Date.now() - this.stats.startTime.getTime();
      const mqttStats = this.mqttHandler.getStats();
      
      console.log({
        uptime: Math.floor(uptime / 1000),
        messagesProcessed: this.stats.messagesProcessed,
        errors: this.stats.errors,
        mqtt: {
          connected: mqttStats.connected,
          responseStats: mqttStats.responseStats
        }
      }, 'Service statistics');
    }, 60000); // Every minute
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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