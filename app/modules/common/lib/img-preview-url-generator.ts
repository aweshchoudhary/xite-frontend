export function generatePreviewUrl(file: File): string | null {
  if (!file) return null;
  const url = URL.createObjectURL(file);
  return url;
}
