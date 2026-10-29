/** Local calendar date as YYYY-MM-DD, without timezone shifts. */
export function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function currentMonthKey() {
  return toISODate(new Date()).slice(0, 7);
}

export function formatMonthLabel(date = new Date()) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatExpenseDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) {
    return iso;
  }

  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatPkr(amount: number) {
  const hasFraction = Math.round(amount * 100) % 100 !== 0;
  return `PKR ${amount.toLocaleString('en-US', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Accepts "2450" or "2,450.50". Returns null when the amount is empty or not above zero. */
export function parseAmount(text: string) {
  const cleaned = text.replace(/,/g, '').trim();
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) {
    return null;
  }

  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return value;
}
