import { loadConfig, GATEWAY_PROFILES } from './config.js';
import { MqttClient } from './mqtt-client.js';

class MockComStarGateway {
  constructor(configOverride = {}) { 
    // Load configuration
    this.config = loadConfig(configOverride);
    this.mqtt = new MqttClient(this.config);
  }

}

async function main() {
  const args = process.argv.slice(2);
  let configOverride = {};
  
  // Parse command line arguments
  args.forEach(async(arg) => {
    if (arg.startsWith('--gateway=')) {
      const profile = arg.split('=')[1];
      if (GATEWAY_PROFILES[profile]) {
        configOverride = GATEWAY_PROFILES[profile];
      }
    } else if (arg.startsWith('--devEui=')) {
      configOverride.devEui = arg.split('=')[1];
    } else if (arg === '--all') {
      // Start multiple gateways
      await startMultipleGateways();
      return;
    }
  });
  
  // Start single gateway
  const gateway = new MockComStarGateway(configOverride);
  // await gateway.start();
  
  // Export for testing
  // global.gateway = gateway;
}


// Run if called directly
if (import.meta.url === 'file://' + process.argv[1]) {
  main().catch(console.error);
}

export { MockComStarGateway };