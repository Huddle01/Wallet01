import { atom } from 'jotai';
import { BaseConnector } from '@wallet01/core';

const connected = atom<boolean>(false);

const account = atom<string | null>(null);

const did = atom<string | null>(null);

const chainId = atom<string | null>(null);

const connectorAtom = atom<BaseConnector | null>(null);

export { connected, account, did, chainId, connectorAtom };
