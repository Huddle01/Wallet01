import { useInitClient, Wallet01 } from '@wallet01/react';
import {
  InjectedConnector,
  CoinbaseConnector,
  WalletconnectConnector,
} from '@wallet01/evm';
import { PhantomConnector, SolflareConnector } from '@wallet01/solana';
import { KeplrConnector } from '@wallet01/cosmos';

import ConnectButtons from './components/ConnectButtons';
import { useEffect } from 'react';

function App() {
  const init = useInitClient();

  useEffect(() => {
    init({
      autoConnect: true,
      connectors: [
        new InjectedConnector(),
        new CoinbaseConnector(),
        new WalletconnectConnector(),
        new PhantomConnector(),
        new SolflareConnector(),
        new KeplrConnector(),
      ],
    });
  }, []);

  return (
    <Wallet01>
      <div className="flex h-screen w-screen gap-5 justify-center items-center">
        <ConnectButtons />
        <h1>Hello World</h1>
      </div>
    </Wallet01>
  );
}

export default App;
