import { useClient, useWallet } from "@wallet01/react";
import ConnectButtons from "../components/ConnectButtons";
import ConnectedModal from "../components/ConnectedModal";
import Nav from "../components/nav";

interface SVGIcons {
  [key: string]: JSX.Element;
}

export default function Home() {
  // const { isAutoConnecting } = useClient();
  const { isConnected } = useWallet();

  console.log({
    isConnected,
  });

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {/* {isAutoConnecting ? (
        <span className="text-xl text-white font-bold">AutoConnecting</span>
      ) : null} */}
      {isConnected ? <ConnectedModal /> : <ConnectButtons />}
    </div>
  );
}
