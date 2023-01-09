import { getDefaultStore } from "jotai/vanilla";
import { atomWithStorage } from "jotai/vanilla/utils";

export const autoConnectAtom = atomWithStorage("autoConnect", true);
export const lastUsedConnectorAtom = atomWithStorage("lastUsedConnector", "");

export const store = getDefaultStore();
