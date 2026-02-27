# Interceptor

### This tool intercepts packets from the HiveMQ MQTT server, with the option to output the result into a file.

## Dependencies
Requires `bun`.

## Environment
Requires 1 fields in `.env` in the root directory:

```.env
MQTT_BROKER
MQTT_USERNAME
MQTT_PASSWORD
```


## Usage:

```bash
bun intercept -t <topic> -o <output file>
```

Both paramaters are optional. If output file is not specified, one will not be created / appended to.