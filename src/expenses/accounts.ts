export const ACCOUNTS = [
  { id: 'cash', name: 'Cash' },
  { id: 'bank', name: 'Bank' },
  { id: 'jazzcash', name: 'JazzCash' },
] as const;

export type AccountId = (typeof ACCOUNTS)[number]['id'];

export function accountName(id: string | undefined) {
  return ACCOUNTS.find((item) => item.id === id)?.name ?? 'Cash';
}
