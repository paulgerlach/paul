// Used to check if the gateway is up to date or requires FW.
import databaseService from "../services/databaseService.js";
import logger from "../utils/logger.js";


interface GatewaySyncItem {
  app: string | null;
  boot: string | null;
  etag: string | null;
}

interface GatewaySyncResponseItem {
  app: string | null | boolean;
  boot: string | null | boolean;
  etag: string | null | boolean;
}

class SyncHandler {
  name: string;
  isUrgent: boolean;

  constructor() {
    this.name = "sync";
    this.isUrgent = true;
  }

  async handle({
    gatewayEui,
    data,
    messageNumber,
  }: {
    gatewayEui: string;
    data: GatewaySyncItem;
    messageNumber: any;
  }): Promise<GatewaySyncResponseItem> {
    console.log({ gatewayEui, messageNumber }, "Processing sync request");

    try {
      // Get desired state from database
      const desiredState =
        await databaseService.getDesiredGatewayState(gatewayEui);

      if (!desiredState) {
        await databaseService.setDesiredGatewayState(
          gatewayEui,
          data.app,
          data.boot,
          data.etag,
        );
        const desiredState =
          await databaseService.getDesiredGatewayState(gatewayEui);

        // explicit return to show that desiredState can fail, will need to handle this
        // when we move the DBService to pure TS
        if (!desiredState) {
          return { app: null, boot: null, etag: null };
        }

        const response: GatewaySyncResponseItem = {
          app: desiredState.app,
          boot: desiredState.boot,
          etag: desiredState.etag,
        };
        return response;
      }

      // Build response according to ComStar spec

      const response = {
        app: this.compareFirmware(data.app, desiredState.app),
        boot: this.compareFirmware(data.boot, desiredState.boot),
        etag: this.compareEtag(data.etag, desiredState.etag),
      };

      return response;
    } catch (error) {
      logger.error(
        {
          gatewayEui,
          requestedEtag: data?.etag || null, //why is this null checked? -H
          error: error.message,
        },
        "Failed to get configuration",
      );

      // Return minimal configuration to keep gateway running
      return {
        app: null,
        boot: null,
        etag: null,
      };
    }
  }

  compareFirmware(
    current: string | null,
    desired: string | null,
  ): boolean | string | null {
    if (!desired) return null; // No desired firmware
    if (current === desired) return true; // Firmware matches
    return desired; // Firmware update needed
  }

  compareEtag(
    current: string | null,
    desired: string | null,
  ): boolean | string | null {
    if (!desired) return null; // No desired config
    if (!current) return desired; // Gateway has no config
    if (current === desired) return true; // Config matches
    return desired; // Config update needed
  }
}

const syncHandler = new SyncHandler();
export default syncHandler;
