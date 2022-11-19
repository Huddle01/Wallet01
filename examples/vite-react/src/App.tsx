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
import Wrapper from './components/Wrapper';

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
      <Wrapper />
    </Wallet01>
  );
}

export default App;
