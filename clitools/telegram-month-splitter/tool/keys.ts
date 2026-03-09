export function getDecryptionKey(): string {
  const key: string | undefined = process.env.SECURE_KEY;
  if (!key) throw Error("SECURE_KEY not set");
  return key;
}
