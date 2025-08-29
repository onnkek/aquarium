import { IARGB, IARGBStatusInfo, IConfig, ICurrentInfo, IPumpConfig, IPumpStatus, IPunpInfo, IRelay, IStatusInfo, ITemp, ITempStatusInfo } from "redux/AquariumSlice"

export type CardType = "relay" | "pump" | "argb" | "temp";
export type RelaySubtype = "light" | "co2" | "o2" | "filter";

export type RelayCardType = {
  type: "relay";
  subtype: RelaySubtype;
  config: IRelay;
  current: IStatusInfo
}
export type ArgbCardType = {
  type: "argb";
  config: IARGB;
  current: IARGBStatusInfo
}
export type TempCardType = {
  type: "temp";
  config: ITemp;
  current: ITempStatusInfo
}
export type PumpCardType = {
  type: "pump";
  config: IPumpConfig;
  current: IPunpInfo
}

export type ICard = RelayCardType | ArgbCardType | TempCardType | PumpCardType;
