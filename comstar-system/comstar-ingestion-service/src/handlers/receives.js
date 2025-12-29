
class ReceivesHandler {
  constructor() {
    this.name = 'receives';
    this.isUrgent = false;
  }

  async handle({ gatewayEui, data, messageNumber }) {
    console.log({ gatewayEui, messageNumber }, 'Processing receives update');
  }

}

const receivesHandler = new ReceivesHandler();
export default receivesHandler;
