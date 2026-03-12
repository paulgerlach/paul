interface BaseGatewayTelegramRecord {
  id: string;           // uuid
  gateway_eui: string;
  telegram: string;
  created_at: string;   // ISO timestamp string (timestamptz)
}

// ────────────────────────────────────────────────

export interface GatewayTelegram extends BaseGatewayTelegramRecord {
  messageNumber: string;
}

// ────────────────────────────────────────────────

export interface GatewayTelegramParserError extends BaseGatewayTelegramRecord {
  error: string;
  telegramLength: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TelegramsParserErrorResponse {
  data: GatewayTelegramParserError[];
  pagination: Pagination;
}