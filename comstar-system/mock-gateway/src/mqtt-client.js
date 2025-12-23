export class MqttClient {
  constructor(config) { 
    this.config = config;
    console.log('MqttClient')
    console.log(`🎯 Mock ComStar Gateway: ${this.config.name}`);
    console.log(`   DevEUI: ${this.config.devEui}`);
    console.log(`   Broker: ${this.config.brokerUrl}`);
    console.log(`   Schedule: ${this.config.listenCron}`)
  }
}