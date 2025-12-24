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

    // 3. Initial STATUS uplink
    await this.delay(100);
    console.log(`[${this.gateway.config.name}] Sending initial status...`);
    await this.gateway.mqtt.publish('up/status', this.generateStatusData());
    
    console.log(`[${this.gateway.config.name}] ✅ Initial uplinks sent`);
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

  generateStatusData() {
    const now = Math.floor(Date.now() / 1000);
    
    return {
      monitor: `connected:1, reg:5, tac:D71E, ci:019C1307, psm:00000001, tau:00111111, RSRP:${55 + Math.floor(Math.random() * 20)}(3/4), RSRQ:${15 + Math.floor(Math.random() * 10)}(3/4), SNR:${30 + Math.floor(Math.random() * 20)}(4/4)`,
      time: now,
      syncTo: now - 3600,
      syncFrom: now - 3598,
      syncTicks: 14978800 + Math.floor(Math.random() * 1000),
      ci: "019C1307",
      tac: "D71E",
      rsrp: 55 + Math.floor(Math.random() * 20),
      rsrq: 15 + Math.floor(Math.random() * 10),
      snr: 30 + Math.floor(Math.random() * 20),
      operator: "26201",
      band: 8,
      apn: "internet.example.com",
      vbat: this.config.simulateLowBattery 
        ? 3500 + Math.floor(Math.random() * 200)  // Low battery
        : 3800 + Math.floor(Math.random() * 200), // Normal battery
      temperature: 200 + Math.floor(Math.random() * 100),
      collected: this.collectionActive,
      telegram: this.state.collectedTelegrams,
      uploading: this.collectionActive ? this.config.mockTelegramCount : 0
    };
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}