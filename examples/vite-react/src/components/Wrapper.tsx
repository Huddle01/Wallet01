import { useWallet } from '@wallet01/react';
import ConnectButtons from './ConnectButtons';
import ConnectedModal from './ConnectedModal';

const Wrapper = () => {
  const { isConnected } = useWallet();

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {isConnected ? <ConnectedModal /> : <ConnectButtons />}
    </div>
  );
};

export default Wrapper;
