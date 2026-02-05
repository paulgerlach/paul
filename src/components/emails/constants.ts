export const HEIDI_BASE_URL = "https://heidisystems.com";

export const buildQrCodeUrl = (url: string, size: number = 150) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    url
  )}&format=png&color=2F6121&bgcolor=FFFFFF&margin=10`;
