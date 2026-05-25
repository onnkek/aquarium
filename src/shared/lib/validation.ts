export function isValidNumber(value: string): boolean {
  const normalized = value.replace(",", ".");
  return /^-?\d+(\.\d+)?$/.test(normalized);
};

export function stripLeadingZero(value: string): string {
  if (value === "") return value;
  if (value === "0") return "0";

  let v = value.replace(",", "."); // для логики используем только точку

  if (v.startsWith("0")) {
    const rest = v.slice(1);
    if (rest.length > 0 && /[1-9]/.test(rest[0])) {
      return rest; // 03 → 3
    }
    if (rest.length > 0 && rest[0] === ".") {
      return "0" + rest;
    }
  }

  return v;
};
export const validateNumber = (
  v: string,
  opts?: {
    allowZero?: boolean;
    min?: number;
    max?: number;
    allowFloat?: boolean;
    allowNegative?: boolean;
  }
) => {
  const allowFloat = opts?.allowFloat ?? true;
  const allowNegative = opts?.allowNegative ?? false;

  // 1. формат
  const pattern = allowFloat
    ? (allowNegative ? /^-?\d+(\.\d+)?$/ : /^\d+(\.\d+)?$/)
    : (allowNegative ? /^-?\d+$/ : /^\d+$/);

  if (!pattern.test(v)) {
    if (!allowNegative && v.includes("-")) {
      return "Отрицательные числа недопустимы";
    }

    return allowFloat
      ? "Неверный формат"
      : "Только целые числа";
  }

  const num = Number(v);

  // 2. запрет нуля
  if (opts?.allowZero === false && num === 0) {
    return "Ноль недопустим";
  }

  // 3. min
  if (opts?.min !== undefined && num < opts.min) {
    return `Минимум ${opts.min}`;
  }

  // 4. max
  if (opts?.max !== undefined && num > opts.max) {
    return `Максимум ${opts.max}`;
  }

  const abs = v.replace("-", "");

  // 5. нормальные нули
  if (abs === "0" || abs.startsWith("0.")) {
    return true;
  }

  // 6. ведущие нули
  if (/^0\d/.test(abs)) {
    return "Лишние нули";
  }

  return true;
};

export const validateString = (
  v: string,
  opts?: {
    minLength?: number;
    maxLength?: number;
    message?: string;
  }
) => {
  const value = v;

  // 1. пустое значение
  if (!value || value.trim().length === 0) {
    return "Поле обязательно";
  }

  const trimmed = value.trim();

  // 2. лишние пробелы внутри строки
  if (/\s{2,}/.test(value)) {
    return "Лишние пробелы";
  }

  // 3. min length
  if (opts?.minLength && trimmed.length < opts.minLength) {
    return `Минимум ${opts.minLength} символов`;
  }

  // 4. max length
  if (opts?.maxLength && trimmed.length > opts.maxLength) {
    return `Максимум ${opts.maxLength} символов`;
  }

  return true;
};

export function validateTime(v: string) {
  const value = (v ?? "").trim();

  if (value.trim() === "" || value === "--:--") {
    return "Выбери время";
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return "Некорректное время";
  }

  return true;
}

export function validateDate(v: string) {
  if (!v) {
    return "Выбери дату";
  }

  // базовая проверка формата YYYY-MM-DD
  const isValid = /^\d{4}-\d{2}-\d{2}$/.test(v);

  if (!isValid) {
    return "Некорректная дата";
  }

  return true;
}
export function validateDateTime(v: string) {
  if (!v) {
    return "Выбери дату и время";
  }

  const isValid =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v);

  if (!isValid) {
    return "Некорректная дата и время";
  }

  return true;
}