import { NetworkType } from "@airgap/beacon-dapp";

export const isNetwork = (str: string | undefined): str is NetworkType => {
  if (!str) return false;
  return Object.values<string>(NetworkType).includes(str.toLowerCase());
};
