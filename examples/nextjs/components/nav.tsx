import Link from "next/link";
import React from "react";
import { Toaster } from "react-hot-toast";

const Nav = () => {
  return (
    <nav className="absolute flex p-4 justify-around items-center w-screen top-0 z-1">
      <Link href="https://huddle01.notion.site/Wallet01-66b9a56d73964fd19614743fb7a38780">
        Docs
      </Link>
      <span className="text-4xl font-black">Wallet01</span>
      <Link href="https://github.com/Huddle01/Wallet01">Github</Link>
    </nav>
  );
};

export default Nav;
