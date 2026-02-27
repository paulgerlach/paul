import mqtt from 'mqtt';

import { Environment } from './config/env';
import { IPacket } from 'mqtt-packet';
import { createWriteStream, WriteStream } from 'fs';

export default class Interceptor {
    env: Environment;
    client: mqtt.MqttClient;
    logfile?: string;
    logfileWriteStream?: WriteStream;

    // may throw if any environment not found
    constructor(topic: string, logfile?: string) {
        this.logfile = logfile;
        this.env = new Environment(); // loaded
        this.client = this.connect();

        this.client.once('connect', () => this.onConnect());
        this.client.on('error', (err) => this.onError(err));
        this.client.on('message', (topic, payload, packet) => this.onMessage(topic, payload, packet));

        this.client.subscribe(topic, (err, granted?) => this.onSubscribe(err, granted));
    }

    private connect(): mqtt.MqttClient {
        const options: mqtt.IClientOptions = this.env.getConnectOptions();
        return mqtt.connect(this.env.config.brokerURL, options);
    }

    private onConnect() {
        console.log("Connected!");
    }

    private onError(err: Error) {
        console.log("Failed to connect: ", err);
    }

    private onSubscribe(err: Error | null, granted?: mqtt.ISubscriptionGrant[]) {
        if (err) throw Error("Could not subscribe");
        else console.log("Subscribed successfully");
    }

    private onMessage(topic: string, payload: Buffer, packet: IPacket) {
        const message = payload.toString();
        console.log("-- new packet -- ");
        console.log('Topic: ', topic);
        console.log('Message: ', message);
        
        // write to file.
        if (this.logfile) {
            if (!this.logfileWriteStream) this.logfileWriteStream = createWriteStream(this.logfile!, {flags: 'a'});

            const entry = `PACKET:\nTOPIC: ${topic}\nMESSAGE: ${message}\n\n`;
            this.logfileWriteStream?.write(entry);
        }
    }
}

