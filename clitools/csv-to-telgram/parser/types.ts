export interface TelegramData {
  device_id: string;
  device_type: string;
  manufacturer: string;
  version: number;
  status?: string;
  src_data: string;

  encrypted: boolean;
}
