import { getDefaultStore } from "jotai/vanilla";
import { atomWithStorage, createJSONStorage } from "jotai/vanilla/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const boolStorage = createJSONStorage(() => AsyncStorage);
const stringStorage = createJSONStorage<string | null>(() => AsyncStorage);

export const autoConnectAtom = atomWithStorage(
  "autoConnect",
  true,
  boolStorage
);
export const lastUsedConnectorAtom = atomWithStorage(
  "lastUsedConnector",
  null,
  stringStorage
);

export const store = getDefaultStore();
