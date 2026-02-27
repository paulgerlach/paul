import { 
    type MQTTConfigInternal,
    QOSType, 
} from "./types";


export default {
    subscribeQOS: QOSType.AT_LEAST_ONCE,
    publishQOS: QOSType.AT_LEAST_ONCE,
    keepalive: 60, // sec
    cleanSession: false,     // transient?
    reconnectPeriod: 5_000, // ms
    connectTimeout: 10_000,
} as MQTTConfigInternal;