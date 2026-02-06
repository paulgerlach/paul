import databaseService from '../services/databaseService.js';

class SyncHandler {
  constructor() { 
    this.name = 'sync';
    this.isUrgent = true;
  }

  async handle({ gatewayEui, data, messageNumber }) { 
    console.log({ gatewayEui, messageNumber }, 'Processing sync request');

    try{
      // Get desired state from database
      const desiredState = await databaseService.getDesiredGatewayState(gatewayEui);

      if (!desiredState) {
        await databaseService.setDesiredGatewayState(gatewayEui, data.app, data.boot, data.etag);
        const desiredState = await databaseService.getDesiredGatewayState(gatewayEui);
        const response = {
          app: desiredState.app,
          boot: desiredState.app,
          etag: desiredState.app,
        };
        return response;
      }
      
      // Build response according to ComStar spec
      const response = {
        app: this.compareFirmware(data.app, desiredState.app),
        boot: this.compareFirmware(data.boot, desiredState.boot),
        etag: this.compareEtag(data.etag, desiredState.etag)
      };
    
      return response;
    } catch (error) {
      logger.error({
        gatewayEui,
        requestedEtag: data?.etag || null,
        error: error.message
      }, 'Failed to get configuration');
      
      // Return minimal configuration to keep gateway running
      return {
        app: null,
        boot: null,
        etag: null
      };
    }

  }


  compareFirmware(current, desired) {
    if (!desired) 
      return null;           // No desired firmware
    if (current === desired) return true; // Firmware matches
    return desired;                      // Firmware update needed
  }
  
  compareEtag(current, desired) {
    if (!desired) return null;           // No desired config
    if (!current) return desired;        // Gateway has no config
    if (current === desired) return true; // Config matches
    return desired;                      // Config update needed
  }
}

const syncHandler = new SyncHandler();
export default syncHandler;