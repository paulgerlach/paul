
export interface MQTTConfigInternal {
    subscribeQOS: QOSType;
    publishQOS: QOSType;
    keepalive: number; // secs
    cleanSession: boolean;
    reconnectPeriod: number;
    connectTimeout: number;
}

export interface MQTTConfig extends MQTTConfigInternal {
    // Environment
    brokerURL: string;
    brokerUsername: string;
    brokerPassword: string;
    clientID: string;
    comstarEncryptionKey: string;
};

export enum QOSType {
    AT_MOST_ONCE = 0,
    AT_LEAST_ONCE = 1,
    EXACTLY_ONCE = 2,
};