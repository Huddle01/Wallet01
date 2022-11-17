import React from 'react';
import { useClient, useConnect, useWallet } from '@wallet01/react';

const ConnectButtons = () => {
  const { connectors } = useClient();
  const { activeConnector, isConnected, name, address } = useWallet();
  const { connect, isLoading, isError, error } = useConnect();
  return (
    <div className="flex flex-col gap-2 items-center w-fit justify-center">
      <span className="text-2xl font-bold">Connection Buttons</span>

      {connectors?.map(connector => (
        <button
          key={connector.name}
          disabled={isConnected && connector !== activeConnector}
          onClick={() => connect({ connector: connector })}
          className="p-3 text-lg w-full rounded-lg font-bold bg-blue-300"
        >
          {isConnected && connector === activeConnector ? name : connector.name}
        </button>
      ))}
    </div>
  );
};

export default ConnectButtons;
