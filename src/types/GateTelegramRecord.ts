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