import { TProvider } from '@wallet01/core';
import { connectorName, connectorObj } from './types';


/**
 * @function connect
 * @param connector "injected" | "walletConnect" | "coinbase" | "keplr" | "solflare" | "phantom"
 * @param _chain The desired chainId to connect wallet to.
 */
export const connect = async (
  connector: connectorName,
  _chain?: string
): Promise<void> => {
  const obj = await connectorObj[connector](_chain);
  if (connector === 'keplr' && !_chain) {
    obj.connect('secret-4');
  } else if (connector === 'injected' && !_chain) obj.connect('1');
  else {
    obj.connect('');
  }
};


/**
 * @function disconnect
 * @param connector "injected" | "walletConnect" | "coinbase" | "keplr" | "solflare" | "phantom"
 */
export const disconnect = async (connector: connectorName): Promise<void> => {
  await connectorObj[connector]().disconnect();
};


/**
 * @function getAccount
 * @param connector "injected" | "walletConnect" | "coinbase" | "keplr" | "solflare" | "phantom"
 * @returns Get an array of all the accounts in the connected wallet.
 */
export const getAccount = async (
  connector: connectorName
): Promise<string[]> => {
  const accounts = await connectorObj[connector]().getAccount();
  return accounts;
};


/**
 * @function getChainId
 * @param connector 
 * @returns ChainId of the connected chain as string
 */
export const getChainId = async (
  connector: connectorName
): Promise<string> => {
  const chainId = await connectorObj[connector]().getChainId();
  return chainId;
};


/**
 * @function getProvider
 * @param connector "injected" | "walletConnect" | "coinbase" | "keplr" | "solflare" | "phantom"
 * @returns Provider object of the connected wallet
 */
export const getProvider = async (
  connector: connectorName
): Promise<TProvider> => {
  const provider = await connectorObj[connector]().getProvider();
  return provider;
};


/**
 * @function resolveDid
 * @param connector "injected" | "walletConnect" | "coinbase" | "keplr" | "solflare" | "phantom"
 * @param address Address of which DID is desired.
 * @returns DID (ex: huddle01.eth)
 */
export const resolveDid = async (
  connector: connectorName,
  address: string
): Promise<string | null> => {
  const did = await connectorObj[connector]().resolveDid(address);
  return did;
};


/**
 * @function signMessage
 * @param connector "injected" | "walletConnect" | "coinbase" | "keplr" | "solflare" | "phantom"
 * @param message The message to be signed by the user.
 */
export const signMessage = async (
  connector: connectorName,
  message: string
): Promise<void> => {
  await connectorObj[connector]().signMessage(message);
};


/**
 * @function switchChain
 * @param connector "injected" | "walletConnect" | "coinbase" | "keplr" | "solflare" | "phantom"
 * @param chainId ID of the chain to be switched to.
 */
export const switchChain = async (
  connector: connectorName,
  chainId: string
): Promise<void> => {
  await connectorObj[connector]().switchChain(chainId);
};
