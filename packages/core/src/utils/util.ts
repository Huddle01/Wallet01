const setLastUsedConnector = (connectorName: string) => {
  if (localStorage.getItem('lastUsedConnector') !== connectorName)
    localStorage.setItem('lastUsedConnector', connectorName);
};

export default setLastUsedConnector;
