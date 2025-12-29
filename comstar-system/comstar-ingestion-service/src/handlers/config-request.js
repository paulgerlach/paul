class ConfigRequestHandler { 
  constructor() {
    this.name = 'config-request';
    this.isUrgent = false;
  }
  
  async handle({ gatewayEui, data, messageNumber }) {
    console.log({ gatewayEui, etag: data.etag, messageNumber }, 'Processing config request');

  }
}

const configRequestHandler = new ConfigRequestHandler();
export default configRequestHandler;