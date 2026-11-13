/** Strip extension and return base filename */
export function baseFileName(name: string): string {
  return name.replace(/\.(xlsx|xlsm)$/i, '');
}

/** Format a number with commas */
export function fmt(n: number): string {
  return n.toLocaleString();
}
