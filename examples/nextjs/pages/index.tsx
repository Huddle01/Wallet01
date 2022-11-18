import { useWallet } from '@wallet01/react';
import ConnectButtons from '../components/ConnectButtons';
import ConnectedModal from '../components/ConnectedModal';

export default function Home() {
  const { isConnected } = useWallet();

  return (
    <div className="flex justify-center items-center">
      {isConnected ? <ConnectedModal /> : <ConnectButtons />}
    </div>
  );
}
