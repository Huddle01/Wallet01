import React from 'react';
import { useClient, useConnect, useWallet } from '@wallet01/react';

const ConnectButtons = () => {
  const { connectors } = useClient();
  const { activeConnector, isConnected, name, address } = useWallet();
  const { connect, isLoading, isError, error } = useConnect();
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold">Connection Buttons</span>

      {connectors?.map(connector => (
        <button
          key={connector.name}
          disabled={connector !== activeConnector}
          onClick={() => connect({ connector: connector })}
        >
          {connector.name}
          {(isConnected && connector == activeConnector) ?? name}
        </button>
      ))}
    </div>
  );
};

export default ConnectButtons;
