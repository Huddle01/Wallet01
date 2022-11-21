import Link from 'next/link';
import React from 'react';

const Nav = () => {
  return (
    <nav className="absolute flex p-4 justify-around items-center w-screen top-0 z-1">
      <Link href="#">Docs</Link>
      <span className="text-4xl font-black">Wallet01</span>
      <Link href="#">Github</Link>
    </nav>
  );
};

export default Nav;
