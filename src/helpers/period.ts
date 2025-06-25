import { IPumpPeriod } from "redux/AquariumSlice";

export function getPeriodString(period: IPumpPeriod): string {

  if (period.su && period.mo && period.tu && period.we && period.th && period.fr && period.sa) {
    return "Every day"
  }
  if (!period.su && !period.mo && !period.tu && !period.we && !period.th && !period.fr && !period.sa) {
    return "Don't work"
  }

  return `${period.su ? "Su" : ""} ${period.mo ? "Mo" : ""} ${period.tu ? "Tu" : ""} ${period.we ? "We" : ""} ${period.th ? "Th" : ""} ${period.fr ? "Fr" : ""} ${period.sa ? "Sa" : ""}`;
}

export function getUptime(microseconds: number, showms: boolean): string {

  const totalMs = Math.floor(microseconds / 1000);
  const ms = totalMs % 1000;

  const totalSec = Math.floor(totalMs / 1000);
  const sec = totalSec % 60;

  const totalMin = Math.floor(totalSec / 60);
  const min = totalMin % 60;

  const totalHours = Math.floor(totalMin / 60);
  const hours = totalHours % 24;

  const days = Math.floor(totalHours / 24);

  const pad = (n: number, len: number = 2) => n.toString().padStart(len, '0');
  const padMs = (n: number) => n.toString().padStart(3, '0');

  return `${days}d ${pad(hours)}:${pad(min)}:${pad(sec)}${showms ? `.${padMs(ms)}` : ''}`;
}