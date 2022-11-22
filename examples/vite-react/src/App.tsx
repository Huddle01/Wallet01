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
import Layout from './components/layout';

function App() {
  const init = useInitClient();

  useEffect(() => {
    init({
      autoConnect: true,
      connectors: [
        new InjectedConnector(),
        new CoinbaseConnector(),
        new PhantomConnector(),
        new SolflareConnector(),
        new KeplrConnector(),
      ],
    });
  }, []);

  return (
    <Wallet01>
      <Layout>
        <Wrapper />
      </Layout>
    </Wallet01>
  );
}

export default App;
