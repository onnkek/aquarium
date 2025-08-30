import { IARGB, IARGBStatusInfo, IPumpConfig, IPumpStatus, IPunpInfo, IRelay, IStatusInfo, ISystem, ISystemInfo, ITemp, ITempStatusInfo } from "redux/AquariumSlice"

export type CardType = "relay" | "pump" | "argb" | "temp";
export type RelaySubtype = "light" | "co2" | "o2" | "filter";

export type SystemCardType = {
  id: string;
  type: "system" | "server";
  config: ISystem;
  current: ISystemInfo;
}
export type RelayCardType = {
  id: string;
  type: "relay";
  subtype: RelaySubtype;
  config: IRelay;
  current: IStatusInfo;
}
export type ArgbCardType = {
  id: string;
  type: "argb";
  config: IARGB;
  current: IARGBStatusInfo;
}
export type TempCardType = {
  id: string;
  type: "temp";
  config: ITemp;
  current: ITempStatusInfo;
}
export type PumpCardType = {
  id: string;
  type: "pump";
  number: number;
  config: IPumpConfig;
  current: IPunpInfo;
}

export type ICard = SystemCardType | RelayCardType | ArgbCardType | TempCardType | PumpCardType;
