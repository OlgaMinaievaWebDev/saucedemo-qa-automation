export function parseMoneyToCents(text: string): number {
  const match = text.match(/^(?:[^$\d]*:\s*)?\$(\d+)\.(\d{2})$/);

  if (!match) {
    throw new Error(`Invalid currency format: ${text}`);
  }

  const cents = Number(match[1]) * 100 + Number(match[2]);
  if (!Number.isSafeInteger(cents)) {
    throw new Error(`Currency amount exceeds safe integer range: ${text}`);
  }
  return cents;
}
