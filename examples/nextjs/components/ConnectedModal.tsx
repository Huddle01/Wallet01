import { useConnect, useMessage, useSwitch, useWallet } from '@wallet01/react';
import React, { useState } from 'react';
import WalletIcons from './assets/WalletIcons';

const ConnectedModal = () => {
  const [message, setMessage] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const { isConnected, name, activeConnector, address, chain, disconnect } =
    useWallet();
  const { signMessage, hash } = useMessage({ message });
  const { switchChain } = useSwitch({ chainId });

  console.log(hash);

  return (
    <div className="flex flex-col">
      <span className="text-lg text-center flex justify-center items-center gap-2 font-base">
        {activeConnector?.name ? WalletIcons[activeConnector.name] : 'Other'}{' '}
        Methods
      </span>
      <div className="grid grid-cols-2 mt-5 justify-center items-center gap-8 border border-slate-600 bg-slate-700 p-4 rounded-lg m-10">
        <div className="flex flex-col p-6 gap-4 max-w-full">
          {name ? (
            <span className="text-xl font-base">
              Hello, <b className="underline underline-offset-1">{name}</b>
            </span>
          ) : (
            ''
          )}
          {address ? (
            <span className="text-xl font-base truncate">
              Address: <br />
              <b className="italic truncate ">{address}</b>
            </span>
          ) : (
            ''
          )}
          <button
            className="bg-slate-600 w-fit p-3 text-medium text-lg rounded-md"
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 max-w-full">
            <div className="flex flex-col gap-2 justify-between">
              <span className="font-bold text-lg">Message:</span>
              <button
                className="bg-blue-400 p-3 min-w-fit font-semibold text-sm text-black rounded-md"
                onClick={() => signMessage()}
              >
                Sign Message
              </button>
            </div>
            <div className="w-full h-fit">
              <textarea
                className="p-2 bg-transparent rounded-lg w-full h-full text-white border border-slate-600"
                value={message}
                placeholder="Enter message"
                onChange={e => setMessage(e.target.value)}
              />
              {hash ? (
                <span className="font-mono break-all w-fit max-w-full ">
                  {hash}
                </span>
              ) : null}
            </div>
          </div>

          <div>
            <span className="font-bold text-lg">Switch Chain To:</span>
            <div className="flex gap-2 mt-2">
              <input
                className="p-2 bg-transparent rounded-lg w-full text-white border border-slate-600"
                value={chainId}
                placeholder="Enter Desired ChainId"
                onChange={e => setChainId(e.target.value)}
              />
              <button
                className="bg-blue-400 p-2 min-w-fit font-semibold text-sm text-black rounded-lg"
                onClick={() => switchChain()}
              >
                Switch Chain
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedModal;
