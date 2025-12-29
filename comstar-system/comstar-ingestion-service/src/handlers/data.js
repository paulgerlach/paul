class DataHandler {
  constructor() {
    this.name = 'data';
    this.isUrgent = false;
  }

  async handle({ gatewayEui, data, messageNumber }) {
    console.log({ gatewayEui, messageNumber }, 'Processing data update');
  }

}

const dataHandler = new DataHandler();
export default dataHandler;