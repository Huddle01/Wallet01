import { useWallet } from '@wallet01/react';
import React from 'react';
import ConnectButtons from './ConnectButtons';
import ConnectedModal from './ConnectedModal';

const Wrapper = () => {
  const { isConnected } = useWallet();
  return (
    <div className="flex justify-center items-center">
      {isConnected ? <ConnectedModal /> : <ConnectButtons />}
    </div>
  );
};

export default Wrapper;
