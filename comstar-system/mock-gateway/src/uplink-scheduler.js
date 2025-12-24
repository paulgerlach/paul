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

  start() {
    console.log(`[${this.gateway.config.name}] Starting uplink scheduler...`);
    
    // 1. Send initial uplinks (simulating boot sequence)
    this.sendInitialUplinks();
  }

  async sendInitialUplinks() {
    // Simulate gateway boot sequence
    
    // Wait a bit (like real hardware booting)
    await this.delay(2000);

    // 1. DEVICE uplink (always first)
    console.log(`[${this.gateway.config.name}] Sending device uplink...`);
    await this.gateway.mqtt.publish('up/device', this.generateDeviceData());
    
    // 2. CONFIG uplink (always second)
    await this.delay(100);
    console.log(`[${this.gateway.config.name}] Sending config uplink...`);
    await this.gateway.mqtt.publish('up/config', this.generateConfigData());
  }

  generateDeviceData() {
    return {
      imei: `35135881${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      imsi: `90140510${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      iccid: `898822806660${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
      model: "nRF9160-SICA",
      modem: "mfw_nrf9160_1.3.4",
      hwversion: "nRF9160 SICA B1A",
      eui: this.config.devEui,
      mcu: "app-mcuboot-nrf9160-sec v1.3.2",
      boot: this.config.bootVersion,
      app: this.config.firmwareVersion,
      board: "nrf9160-sx-gw2",
      reboot_code: 1,
      reboot_reason: this.state.bootReason,
      assert: "",
      final_words: ""
    };
  }

  generateConfigData() {
    return {
      Host: this.config.brokerUrl,
      UseLtem: this.config.useLtem,
      UseNbiot: this.config.useNbiot,
      WAN: this.config.wan,
      listenCron: this.config.listenCron,
      listenCronDurSec: this.config.listenCronDurSec,
      maxTelegrams: this.config.maxTelegrams,
      devFilter: this.config.devFilter,
      mFilter: this.config.mFilter,
      typFilter: this.config.typFilter,
      ciFilter: this.config.ciFilter,
      RndDelay: this.config.rndDelay,
      LostReboot: 7,
      etag: this.state.lastSyncEtag || `config-${Date.now().toString(16)}`
    };
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}