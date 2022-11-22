import { useWallet } from '@wallet01/react';
import ConnectButtons from '../components/ConnectButtons';
import ConnectedModal from '../components/ConnectedModal';
import Nav from '../components/nav';

interface SVGIcons {
  [key: string]: JSX.Element;
}

export default function Home() {
  const { isConnected } = useWallet();

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {isConnected ? <ConnectedModal /> : <ConnectButtons />}
    </div>
  );
}
