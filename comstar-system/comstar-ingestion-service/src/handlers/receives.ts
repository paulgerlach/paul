class ReceivesHandler {
  name: string;
  isUrgent: false;

  constructor() {
    this.name = "receives";
    this.isUrgent = false;
  }

  async handle({ gatewayEui, data, messageNumber }) {
    console.log("data is unused in this function", { data });
    console.log({ gatewayEui, messageNumber }, "Processing receives update");
  }
}

const receivesHandler = new ReceivesHandler();
export default receivesHandler;
