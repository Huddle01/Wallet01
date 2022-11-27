import React from 'react';
import { Toaster } from 'react-hot-toast';
import Nav from './nav';

interface Props {
  children: JSX.Element;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <Nav />
      {children}
    </div>
  );
};

export default Layout;
