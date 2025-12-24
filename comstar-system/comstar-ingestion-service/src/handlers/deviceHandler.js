export default {
  name: 'device',
  isUrgent: false,
  
  async handle({ gatewayEui, data }) {
    // Just log it and move on
    console.log('📱 DEVICE UPLINK:', {
      gateway: gatewayEui,
      firmware: data.app?.substring(0, 30) || 'none',
      model: data.model || 'unknown',
      reboot: data.reboot_reason || 'none'
    });
    
    // That's it! No database, no validation, no nothing
    return { logged: true };
  }
};