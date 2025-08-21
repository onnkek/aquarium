export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (value: number) => Math.max(0, Math.min(255, value));

  const toHex = (value: number) =>
    clamp(value).toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Удаляем символ "#" если он есть
  const normalizedHex = hex.replace(/^#/, '');

  // Поддержка короткого формата (#abc)
  const fullHex =
    normalizedHex.length === 3
      ? normalizedHex.split('').map(c => c + c).join('')
      : normalizedHex;

  // if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
  //   return null; // Невалидный hex
  // }

  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);

  return { r, g, b };
}