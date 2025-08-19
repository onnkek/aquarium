import { IPumpPeriod, ITimeInfo } from "redux/AquariumSlice";

export function getPeriodString(period: IPumpPeriod): string {

  if (period.su && period.mo && period.tu && period.we && period.th && period.fr && period.sa) {
    return "Every day"
  }
  if (!period.su && !period.mo && !period.tu && !period.we && !period.th && !period.fr && !period.sa) {
    return "Don't work"
  }

  return `${period.su ? "Su" : ""} ${period.mo ? "Mo" : ""} ${period.tu ? "Tu" : ""} ${period.we ? "We" : ""} ${period.th ? "Th" : ""} ${period.fr ? "Fr" : ""} ${period.sa ? "Sa" : ""}`;
}

export function getDateString(dateTime: ITimeInfo) {
  return `${getDayOfWeek(dateTime.dayOfWeek)} ${getMonth(dateTime.month)} ${dateTime.day}`;
}

export function getTimeString(dateTime: ITimeInfo) {
  return `${dateTime.hour}:${dateTime.minute}:${dateTime.second}`;
}

export function getStringMode(mode: number) {
  switch (mode) {
    case 0:
    case 1:
      return "Manual";
    case 2:
      return "Auto";
    default:
      return "";
  }
}
export function getStringTempMode(mode: number) {
  switch (mode) {
    case 0:
    case 1:
    case 2:
    case 3:
      return "Manual";
    case 4:
      return "Auto";
    default:
      return "";
  }
}

export function getStringARGBMode(mode: number) {
  switch (mode) {
    case 0:
      return "Off";
    case 1:
      return "Static";
    case 2:
      return "Cycle";
    case 3:
      return "Gradient";
    case 4:
      return "Custom";
    default:
      return "";
  }
}

export function invertMode(mode: number) {
  switch (mode) {
    case 1:
      return 0;
    case 0:
      return 1;
    default:
      return -1;
  }
}
export function invertCoolMode(mode: number) {
  console.log(mode)
  switch (mode) { // 0 - off, 1 - cool, 2 - heat, 3 - cool+heat, 4 - auto
    case 0:
      return 1;
    case 1:
      return 0;
    case 2:
      return 3;
    case 3:
      return 2;
    default:
      return -1;
  }
}
export function invertHeatMode(mode: number) {
  console.log(mode)
  switch (mode) { // 0 - off, 1 - cool, 2 - heat, 3 - cool+heat, 4 - auto
    case 0:
      return 2;
    case 1:
      return 3;
    case 2:
      return 0;
    case 3:
      return 1;
    default:
      return -1;
  }
}

function getDayOfWeek(dayOfWeek: string) {
  switch (dayOfWeek) {
    case "su":
      return "Sun";
    case "mo":
      return "Mon";
    case "tu":
      return "Tue";
    case "we":
      return "Wed";
    case "th":
      return "Thu";
    case "fr":
      return "Fri";
    case "sa":
      return "Sat";
    default:
      return "";
  }
}
function getMonth(month: number) {
  switch (month) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
    default:
      return "";
  }
}

export function getDateTimeFromInput(dateString: string) {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds()
  }
}

export function getDateTimeISO(dateTime: ITimeInfo) {
  const month = dateTime.month < 10 ? `0${dateTime.month}` : dateTime.month;
  const day = dateTime.day < 10 ? `0${dateTime.day}` : dateTime.day;
  const hour = dateTime.hour < 10 ? `0${dateTime.hour}` : dateTime.hour;
  const minute = dateTime.minute < 10 ? `0${dateTime.minute}` : dateTime.minute;
  const second = dateTime.second < 10 ? `0${dateTime.second}` : dateTime.second;
  return `${dateTime.year}-${month}-${day}T${hour}:${minute}:${second}`
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