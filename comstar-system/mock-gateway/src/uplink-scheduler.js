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

    // 2. Start cron-based collection schedule
    this.startCollectionSchedule();

    // 3. Start periodic status updates
    this.startStatusUpdates();
    
    // 4. Start periodic sync requests
    this.startSyncRequests();
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

  startCollectionSchedule() {
    console.log(`[${this.gateway.config.name}] Collection schedule: ${this.config.listenCron}`);
    
    // For testing: use fixed interval instead of cron
    const interval = this.config.collectionInterval || 30000; // 30 seconds
    
    const timer = setInterval(() => {
      this.startCollectionCycle();
    }, interval);
    
    this.timers.set('collection', timer);
    
    // Log next collection
    setTimeout(() => {
      console.log(`[${this.gateway.config.name}] First collection in ${interval/1000} seconds...`);
    }, 1000);
  }
  
  stopAllTimers() {
    this.timers.forEach(timer => clearInterval(timer));
    this.timers.clear();
    this.collectionActive = false;
  }
  async startCollectionCycle() {
    if (this.collectionActive) {
      console.log(`[${this.gateway.config.name}] ⏸️ Collection already active, skipping...`);
      return;
    }
    
    this.collectionActive = true;
    this.state.collectionsCompleted++;
    
    console.log(`[${this.gateway.config.name}] 🌀 Starting collection cycle...`);
    
    try {
      // 1. Send status showing collection started
      await this.gateway.mqtt.publish('up/status', {
        ...this.generateStatusData(),
        collected: true,
        telegram: 0,
        uploading: this.config.mockTelegramCount
      });
      
      // 2. Simulate collection duration
      const collectionDuration = this.config.listenCronDurSec * 1000 || 30000;
      
      // 3. Collect telegrams over time
      const telegramsPerSecond = Math.ceil(this.config.mockTelegramCount / (collectionDuration / 1000));
      
      let collected = 0;
      const collectionInterval = setInterval(async () => {
        if (collected >= this.config.mockTelegramCount) {
          clearInterval(collectionInterval);
          this.endCollectionCycle();
          return;
        }
        
        // Collect a batch of telegrams
        const batchSize = Math.min(telegramsPerSecond, this.config.mockTelegramCount - collected);
        await this.collectTelegrams(batchSize);
        collected += batchSize;
        
        // Update status
        this.state.collectedTelegrams += batchSize;
        
      }, 1000);
      
      // Auto-stop after duration
      setTimeout(() => {
        clearInterval(collectionInterval);
        this.endCollectionCycle();
      }, collectionDuration);
      
    } catch (error) {
      console.error(`[${this.gateway.config.name}] ❌ Collection error:`, error.message);
      this.collectionActive = false;
    }
  }

  startStatusUpdates() {
    // Send status every 5 minutes
    const timer = setInterval(async () => {
      try {
        await this.gateway.mqtt.publish('up/status', this.generateStatusData());
      } catch (error) {
        console.error(`[${this.gateway.config.name}] ❌ Status update failed:`, error.message);
      }
    }, 300000); // 5 minutes
    
    this.timers.set('status', timer);
  }

  startSyncRequests() {
    // Send sync request every 10 minutes
    const timer = setInterval(async () => {
      await this.sendSyncRequest();
    }, 600000); // 10 minutes
    
    this.timers.set('sync', timer);
    
    // Send initial sync request
    setTimeout(() => {
      this.sendSyncRequest();
    }, 5000);
  }
  
  async endCollectionCycle() {
    this.collectionActive = false;
    
    console.log(`[${this.gateway.config.name}] ✅ Collection complete. Collected ${this.state.collectedTelegrams} telegrams`);
    
    // Send final status
    await this.gateway.mqtt.publish('up/status', {
      ...this.generateStatusData(),
      collected: false,
      telegram: this.state.collectedTelegrams,
      uploading: 0
    });
    
    // Send sync request to check for updates
    await this.sendSyncRequest();
  }

  async collectTelegrams(count) {
    console.log(`[${this.gateway.config.name}] Collecting ${count} telegrams...`);
    
    for (let i = 0; i < count; i++) {
      try {
        await this.sendDataUplink();
        await this.delay(50); // Small delay between telegrams
      } catch (error) {
        console.error(`[${this.gateway.config.name}] ❌ Failed to send telegram:`, error.message);
      }
    }
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

  // Handle downlink responses
  async handleDownlink(downlink) {
    const { topic, message } = downlink;
    
    if (topic.includes('/down/sync')) {
      await this.handleSyncResponse(message);
    } else if (topic.includes('/down/config')) {
      await this.handleConfigResponse(message);
    } else if (topic.includes('/down/fw')) {
      await this.handleFirmwareResponse(message);
    }
  }
  
  // Generate realistic-looking wM-Bus telegram
  generateWmBusTelegram(meter) {
    // Create a realistic-looking hex telegram
    const header = '2f44'; // wM-Bus header
    const manufacturer = Buffer.from(meter.manufacturer).toString('hex').padStart(6, '0');
    const serial = parseInt(meter.serial).toString(16).padStart(8, '0');
    const version = meter.version.padStart(2, '0');
    const type = meter.type.padStart(2, '0');
    const value = Math.floor(meter.value * 1000).toString(16).padStart(8, '0');
    
    // Combine parts
    const telegram = `${header}${manufacturer}${serial}${version}${type}${value}`;
    
    // Add some random bytes to make it look real
    const randomBytes = Buffer.alloc(10);
    for (let i = 0; i < 10; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }
    
    return telegram + randomBytes.toString('hex').substring(0, 20);
  }

  async publishUplink(type, data) {
    const topic = `LOB/${this.devEui}/${type}`;
    const message = {
      i: this.devEui,
      n: this.uplinkCounter++,
      q: type.split('/').pop(),
      d: data
    };

    const encoded = await cbor.encodeAsync(message);
    this.client.publish(topic, encoded, { qos: 1 });
    console.log(`Published to ${topic}`);
    
    // Also publish as JSON for debugging
    this.client.publish(`${topic}/json`, JSON.stringify(message), { qos: 0 });
  }

  async sendReceivesUplink() {
    const receivesData = {
      's/a': Math.floor(Math.random() * 10),
      's/a.error': Math.floor(Math.random() * 2),
      'c/a': Math.floor(Math.random() * 100),
      'c/a.error': Math.floor(Math.random() * 10),
      'c/b': Math.floor(Math.random() * 200),
      'c/b.error': Math.floor(Math.random() * 20),
      't/a': Math.floor(Math.random() * 50),
      't/a.error': Math.floor(Math.random() * 5),
      'sum': Math.floor(Math.random() * 300),
      'sum.error': Math.floor(Math.random() * 30)
    };
    
    await this.gateway.mqtt.publish('up/receives', receivesData);
  }
  
  async sendDataUplink() {
    const telegram = this.gateway.telegramGenerator.generateTelegram();
    
    await this.gateway.mqtt.publish('up/data', {
      timestamp: Math.floor(Date.now() / 1000),
      telegram: telegram.hex,
      rssi: -60 + Math.floor(Math.random() * 30),
      mode: ['C', 'T', 'S'][Math.floor(Math.random() * 3)],
      type: ['A', 'B'][Math.floor(Math.random() * 2)]
    });
    
    // Occasionally send diagnostic data
    if (Math.random() > 0.9) {
      await this.sendReceivesUplink();
    }
  }
  
  async sendReceivesUplink() {
    const receivesData = {
      's/a': Math.floor(Math.random() * 10),
      's/a.error': Math.floor(Math.random() * 2),
      'c/a': Math.floor(Math.random() * 100),
      'c/a.error': Math.floor(Math.random() * 10),
      'c/b': Math.floor(Math.random() * 200),
      'c/b.error': Math.floor(Math.random() * 20),
      't/a': Math.floor(Math.random() * 50),
      't/a.error': Math.floor(Math.random() * 5),
      'sum': Math.floor(Math.random() * 300),
      'sum.error': Math.floor(Math.random() * 30)
    };
    
    await this.gateway.mqtt.publish('up/receives', receivesData);
  }

  // Send sync request (q = 'sync')

  async sendSyncRequest() {
    console.log(`[${this.gateway.config.name}] Sending sync request...`);
    
    const syncData = {
      app: this.config.firmwareVersion,
      boot: this.config.bootVersion,
      etag: this.state.lastSyncEtag || `config-${Date.now().toString(16)}`
    };
    
    await this.gateway.mqtt.publish('req/sync', syncData);
  }

  getState() {
    return {
      ...this.state,
      collectionActive: this.collectionActive,
      timers: this.timers.size
    };
  }

  async handleSyncResponse(response) {
    console.log(`[${this.gateway.config.name}] Processing sync response...`);
    
    const { d: data } = response;
    
    // Check if config update needed
    if (data.etag && data.etag !== true && data.etag !== this.state.lastSyncEtag) {
      console.log(`[${this.gateway.config.name}] Config update needed (etag: ${data.etag})`);
      this.state.pendingConfigUpdate = true;
      await this.requestConfigUpdate(data.etag);
    }
    
    // Check if firmware update needed
    if (data.app && typeof data.app === 'string' && data.app.includes('+')) {
      console.log(`[${this.gateway.config.name}] Firmware update requested: ${data.app}`);
      await this.requestFirmwareUpdate(data.app);
    }
  }
  
  async handleConfigResponse(response) {
    console.log(`[${this.gateway.config.name}] Processing config response...`);
    
    const { d: data } = response;
    
    if (data.config && data.etag) {
      console.log(`[${this.gateway.config.name}] Received new configuration`);
      
      // Update configuration
      Object.assign(this.config, data.config);
      this.state.lastSyncEtag = data.etag;
      this.state.pendingConfigUpdate = false;
      
      // Simulate reboot (as real gateway would)
      await this.simulateReboot();
    }
  }

  async handleFirmwareResponse(response) {
    console.log(`[${this.gateway.config.name}] Processing firmware response...`);
    // In real gateway, this would write firmware chunks
    console.log(`Firmware chunk: ${JSON.stringify(response.d)}`);
  }

  async simulateReboot() {
    console.log(`[${this.gateway.config.name}] 🔄 Simulating gateway reboot...`);
    
    // Stop all activities
    this.stopAllTimers();
    
    // Update state
    this.state.lastBootTime = Date.now();
    this.state.bootReason = 'config_update';
    this.state.collectedTelegrams = 0;
    
    // Wait (simulating reboot time)
    await this.delay(3000);
    
    // Restart
    this.start();
  }
  
  async requestConfigUpdate(newEtag) {
    console.log(`[${this.gateway.config.name}] Requesting config update...`);
    
    await this.gateway.mqtt.publish('req/config', {
      etag: newEtag
    });
  }
  
  async requestFirmwareUpdate(firmwareFile) {
    console.log(`[${this.gateway.config.name}] Requesting firmware: ${firmwareFile}`);
    
    await this.gateway.mqtt.publish('req/fw', {
      f: firmwareFile,
      c: 0
    });
  }
}