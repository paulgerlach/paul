## Info
1. comstar-system: Digital Ocean Droplet (Github) - Dashboard
    1. comstar-ingestion-service -> Ingestion-Service -> Server, server logs
    2. mock-gateway -> (testing) - proof of concept
    3. mqtt-broker -> 1G/10G ssd -> Scaled Load
2.  

## Infrastructure
1. Postgres (`DATABASE_URL`) - stores newsletter leads
2. Vercel - Main App
3. DigitalOcean - Droplet for running MQTT service

## Setup for dev


## Running The Server
```bash
bun dev
```
