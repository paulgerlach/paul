
class SyncHandler {
  constructor() { 
    this.name = 'sync';
    this.isUrgent = true;
  }

  async handle({ gatewayEui, data, messageNumber }) { 
    console.log({ gatewayEui, messageNumber }, 'Processing sync request');

    // Get desired state from database
    // const desiredState = await databaseService.getDesiredGatewayState(gatewayEui);

    // Build response according to ComStar spec
    // const response = {
    //   app: this.compareFirmware(data.app, desiredState.app),
    //   boot: this.compareFirmware(data.boot, desiredState.boot),
    //   etag: this.compareEtag(data.etag, desiredState.etag)
    // };

    // console.log({
    //   gatewayEui,
    //   current: { app: data.app, etag: data.etag },
    //   desired: desiredState,
    //   response
    // }, 'Sync response prepared');
    
    // return response;

  }


  compareFirmware(current, desired) {
    return current;
    // if (!desired) 
    //   return null;           // No desired firmware
    // if (current === desired) return true; // Firmware matches
    // return desired;                      // Firmware update needed
  }
  
  compareEtag(current, desired) {
    return current;
    // if (!desired) return null;           // No desired config
    // if (!current) return desired;        // Gateway has no config
    // if (current === desired) return true; // Config matches
    // return desired;                      // Config update needed
  }
}

const syncHandler = new SyncHandler();
export default syncHandler;