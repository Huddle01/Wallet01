import { useConnect, useMessage, useSwitch, useWallet } from '@wallet01/react';
import React, { useState } from 'react';

const ConnectedModal = () => {
  const [message, setMessage] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const { isConnected, name, activeConnector, address, chain, disconnect } =
    useWallet();
  const { signMessage } = useMessage({ message });
  const { switchChain } = useSwitch({ chainId });

  return (
    <div className="flex gap-10 border border-blue-300 p-4 rounded-md">
      <div className="flex flex-col gap-4 max-w-full">
        {name ? <span className="text-xl font-bold">Hello, {name}</span> : ''}
        {address ? (
          <span className="text-xl font-bold">Address: {address}</span>
        ) : (
          ''
        )}
        <button
          className="bg-blue-300 w-fit p-3 text-medium text-lg rounded-md"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-lg font-medium">
          {activeConnector?.name ?? 'Other'} Methods
        </span>
        <textarea
          className="p-1 border border-slate-300"
          value={message}
          placeholder="Enter message"
          onChange={e => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-300 p-3 text-medium text-lg rounded-md"
          onClick={() => signMessage()}
        >
          Sign Message
        </button>
        <input
          className="border border-slate-300 p-1"
          placeholder="Enter ChainId"
          value={chainId}
          onChange={e => setChainId(e.target.value)}
        />
        <button
          className="bg-blue-300 p-3 text-medium text-lg rounded-md"
          onClick={() => switchChain()}
        >
          Switch Chain
        </button>
      </div>
    </div>
  );
};

export default ConnectedModal;
