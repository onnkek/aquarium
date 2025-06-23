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