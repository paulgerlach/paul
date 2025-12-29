class FwRequestHandler { 
  constructor() {
    this.name = 'fw-request';
    this.isUrgent = false;
  }
  async handle({ gatewayEui, data, messageNumber }) {
    console.log({ gatewayEui, messageNumber }, 'Processing fw request');
  }
}

const fwRequestHandler = new FwRequestHandler();
export default fwRequestHandler;