import { File, Paths } from 'expo-file-system';

/** Copies a picked photo into app storage so it stays after the picker cache is cleared. */
export function saveReceipt(uri: string) {
  const source = new File(uri);
  const dest = new File(Paths.document, `receipt-${Date.now()}.jpg`);
  source.copy(dest);
  return dest.uri;
}
