import { GatewayTelegramParserError } from "./GateTelegramRecord";

export interface Telegram {
  id: string;
  gateway_eui: string;
  telegram_hex: string;
  type: string;
  rssi: number;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TelegramsResponse {
  data: Telegram[] ;
  pagination: Pagination;
}