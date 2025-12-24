export class UplinkScheduler {
  constructor(gateway) { 
    this.gateway = gateway;
    this.config = gateway.config;
    this.timers = new Map();
    this.collectionActive = false;
    
    // Gateway state
    this.state = {
      lastBootTime: Date.now(),
      bootReason: this.config.rebootReason,
      collectedTelegrams: 0,
      collectionsCompleted: 0,
      lastSyncEtag: null,
      pendingConfigUpdate: false
    };
  }
}