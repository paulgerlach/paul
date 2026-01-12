class StatusHandler {
  constructor() {
    this.name = 'status';
    this.isUrgent = true;
  }

  async handle({ gatewayEui, data, messageNumber }) {
    // console.log({ gatewayEui, messageNumber }, 'Processing status update');
  }

}

const statusHandler = new StatusHandler();
export default statusHandler;