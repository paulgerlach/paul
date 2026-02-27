import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // local

import defaults from './defaults';

import {
    type MQTTConfig,
} from './types';
import mqtt from 'mqtt';


export class Environment {
    config: MQTTConfig;

    constructor() {
        this.config = this.getEnv();
    }

    getEnv(): MQTTConfig {
        // Broker
        const brokerURL: string | undefined = process.env.MQTT_BROKER;
        if (!brokerURL) throw Error(`Missing environment variable: MQTT_BROKER`);
        
        // Username
        let brokerUsername: string | undefined = process.env.MQTT_USERNAME;
        if (!brokerUsername) throw Error(`Missing environment variable: MQTT_USERNAME`);
        
        // Password
        let brokerPassword: string | undefined = process.env.MQTT_PASSWORD;
        if (!brokerPassword) throw Error(`Missing environment variable: MQTT_PASSWORD`);
        
        // Client ID
        let clientID: string | undefined = process.env.MQTT_CLIENT_ID;
        if (!clientID) clientID = `cli-user-random-${crypto.randomUUID()}`;

        // UNUSED: Encryption Key
        let comstarEncryptionKey: string | undefined = process.env.COMSTAR_ENCRYPTION_KEY;
        if (!comstarEncryptionKey) comstarEncryptionKey = '' // throw Error(`Missing environment variable: COMSTAR_ENCRYPTION_KEY`);

        
        let mqttConfig: MQTTConfig = {
            brokerURL: brokerURL,
            brokerUsername: brokerUsername,
            brokerPassword: brokerPassword,
            clientID: clientID,
            comstarEncryptionKey: comstarEncryptionKey,
            ...defaults // if there ever was, at some point, some reason to like js/ts
        };

        return mqttConfig;
    }

    getConnectOptions(): mqtt.IClientOptions {
        return {
            clientId: this.config.clientID,
            username: this.config.brokerUsername,
            password: this.config.brokerPassword,
            clean: this.config.cleanSession,
            keepalive: this.config.keepalive,
            reconnectPeriod: this.config.reconnectPeriod,
            connectTimeout: this.config.connectTimeout,
        };
    }

};