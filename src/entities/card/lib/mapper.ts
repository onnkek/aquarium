import { IConfig, ICurrentInfo } from "redux/AquariumSlice";
import { CardType, ICard, RelaySubtype } from "../model/types";


export function mapConfigToCards(config: IConfig, current: ICurrentInfo): ICard[] {

  const cards: ICard[] = [];
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
    if (current[key] && config[key]) {
      cards.push({
        id: `relay-${key}`,
        type: "relay",
        subtype: key,
        config: config[key],
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
        config: config.doser[index],
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