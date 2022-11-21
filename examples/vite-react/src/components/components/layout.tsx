import React from 'react';
import Nav from '../nav';

interface Props {
  children: JSX.Element;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Nav />
      {children}
    </div>
  );
};

export default Layout;
