function toLocalMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseLocalDate(dateString: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return new Date(Number.NaN);
  }

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return new Date(Number.NaN);
  }

  return date;
}

function isValidDate(date: Date): boolean {
  return Number.isFinite(date.getTime());
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addDaysToLocalDate(dateString: string, days: number): string {
  const date = parseLocalDate(dateString);
  date.setDate(date.getDate() + days);

  return formatLocalDate(date);
}

export function getDaysUntilExpiry(expiryDate?: string): number | null {
  if (!expiryDate) {
    return null;
  }

  const today = toLocalMidnight(new Date());
  const expiry = toLocalMidnight(parseLocalDate(expiryDate));
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  if (!isValidDate(expiry)) {
    return null;
  }

  return Math.round((expiry.getTime() - today.getTime()) / millisecondsPerDay);
}

export function isExpiringSoon(
  expiryDate?: string,
  thresholdDays = 3
): boolean {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);

  if (daysUntilExpiry === null) {
    return false;
  }

  return daysUntilExpiry >= 0 && daysUntilExpiry <= thresholdDays;
}

export function getExpiryLabel(expiryDate?: string): string {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);

  if (daysUntilExpiry === null) {
    return "未设置保质期";
  }

  if (daysUntilExpiry < 0) {
    return "已过期";
  }

  if (daysUntilExpiry === 0) {
    return "今天过期";
  }

  if (daysUntilExpiry === 1) {
    return "明天过期";
  }

  return `还有 ${daysUntilExpiry} 天过期`;
}
