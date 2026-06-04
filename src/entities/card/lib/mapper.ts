import { IConfig, ICurrentInfo } from "redux/AquariumSlice";
import { ICard, RelaySubtype } from "../model/types";
import { IDoserStateItem } from "redux/aquariumTypes";

function getTodayYmd(current: ICurrentInfo): string {
  const time = current.system?.time;
  if (!time?.year || !time?.month || !time?.day) return "";

  return `${time.year}-${String(time.month).padStart(2, "0")}-${String(time.day).padStart(2, "0")}`;
}

function hasRunToday(doserState: IDoserStateItem[] | undefined, index: number, today: string): boolean {
  if (!today) return false;
  return doserState?.[index]?.lastRunYmd === today;
}

export function mapConfigToCards(
  config: IConfig,
  current: ICurrentInfo,
  doserState: IDoserStateItem[] = []
): ICard[] {
  const cards: ICard[] = [];
  const today = getTodayYmd(current);

  if (current.system && config.system) {
    cards.push({
      id: "system",
      type: "system",
      config: config.system,
      current: current.system
    });
  }

  const relayKeys: RelaySubtype[] = ["co2", "o2", "filter", "light"];
  relayKeys.forEach(key => {
    if (current[key] && config.relays?.[key]) {
      cards.push({
        id: `relay-${key}`,
        type: "relay",
        subtype: key,
        config: config.relays[key],
        current: current[key]
      });
    }
  });

  if (current.temp && config.temp) {
    cards.push({
      id: "temp",
      type: "temp",
      config: config.temp,
      current: current.temp
    });
  }

  if (current.argb && config.argb) {
    cards.push({
      id: "argb",
      type: "argb",
      config: config.argb,
      current: current.argb
    });
  }

  if (current.doser && config.doser) {
    current.doser.forEach((currentPump, index) => {
      cards.push({
        id: `pump-${index}`,
        type: "pump",
        number: index,
        config: {
          ...config.doser[index],
          status: currentPump.running || currentPump.status ? 1 : 0,
          hasRunToday: hasRunToday(doserState, index, today),
        },
        current: currentPump
      });
    });
  }

  if (current.system && config.system) {
    cards.push({
      id: "server",
      type: "server",
      config: config.system,
      current: current.system
    });
  }

  return cards;
}
