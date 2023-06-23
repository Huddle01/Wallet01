import { NetworkType } from "@airgap/beacon-dapp";

export const isNetwork = (str: string | undefined): str is NetworkType => {
  if (!str) return false;
  return Object.values<string>(NetworkType).includes(str.toLowerCase());
};

const Networks = [
  "mainnet",
  "ithacanet",
  "hangzhounet",
  "idiazabalnet",
  "granadanet",
  "edo2net",
  "florencenet",
  "sandbox",
] as const;

type NetworkKeys = (typeof Networks)[number];

export const isTempleNetwork = (
  str: string | undefined
): str is NetworkKeys => {
  if (!str) return false;
  return Networks.includes(str.toLowerCase() as NetworkKeys);
};
