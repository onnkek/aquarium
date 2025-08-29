import { IConfig, ICurrentInfo } from "redux/AquariumSlice";
import { CardType, ICard, RelaySubtype } from "../model/types";


export function mapConfigToCards(config: IConfig, current: ICurrentInfo): ICard[] {

  const cards: ICard[] = [];

  const relayKeys: RelaySubtype[] = ["co2", "o2", "filter", "light"];
  relayKeys.forEach(key => {
    if (current[key] && config[key]) {
      cards.push({
        type: "relay",
        subtype: key,
        config: config[key],
        current: current[key]
      });
    }
  });
  if (current.temp && config.temp) {
    cards.push({
      type: "temp",
      config: config.temp,
      current: current.temp
    });
  }
  if (current.argb && config.argb) {
    cards.push({
      type: "argb",
      config: config.argb,
      current: current.argb
    });
  }
  if (current.doser && config.doser) {
    current.doser.forEach((currentPump, index) => {
      cards.push({
        type: "pump",
        config: config.doser[index],
        current: currentPump
      });
    });
  }
  return cards;
}