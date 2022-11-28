import { useClient, useConnect, useWallet } from '@wallet01/react';
import WalletIcons from './assets/WalletIcons';

const ConnectButtons = () => {
  const { connectors } = useClient();
  const { activeConnector, isConnected, name, address } = useWallet();
  const { connect } = useConnect();

  return (
    <div className="flex flex-col">
      <span className="font-bold text-lg text-center w-full">
        Choose the desired Wallet
      </span>
      <div className="grid grid-cols-3 gap-4 items-center mt-5 w-fit justify-center">
        {connectors?.map(connector => (
          <button
            key={connector.name}
            disabled={isConnected && connector !== activeConnector}
            onClick={() => {
              connect({
                connector: connector,
                chainId: connector.name === 'Injected' ? '137' : undefined,
              });
            }}
            className="p-3 text-lg flex justify-center items-center leading-relaxed aspect-square w-full rounded-lg border border-slate-600 font-bold bg-slate-700"
          >
            {WalletIcons[connector.name] ?? connector.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConnectButtons;
