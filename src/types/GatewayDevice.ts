export interface GatewayDevice {
  id: string;
  eui: string;
  imei: string;
  imsi: string;
  iccid: string;
  model: string;
  firmware: string;
  boot_version: string;
  last_seen: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
