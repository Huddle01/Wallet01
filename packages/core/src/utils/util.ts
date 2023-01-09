import { lastUsedConnectorAtom, store } from "../store/atoms";

const setLastUsedConnector = (connectorName: string) => {
  store.set(lastUsedConnectorAtom, connectorName);
};

export default setLastUsedConnector;
