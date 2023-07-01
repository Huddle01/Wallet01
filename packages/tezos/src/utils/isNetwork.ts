import { NetworkType, Networks } from "../types";

export const isNetwork = (str: string | undefined): str is Networks => {
  if (!str) return false;
  return Object.values<string>(NetworkType).includes(str.toLowerCase());
};

export const isTempleNetwork = (str: string | undefined): str is Networks => {
  if (!str) return false;
  return Object.values(NetworkType).includes(str.toLowerCase() as Networks);
};
