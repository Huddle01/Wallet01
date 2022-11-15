// Not needed anymore

import { atom } from 'jotai';
import { BaseConnector } from '@wallet01/core';

const connectedAtom = atom<boolean>(false);

const accountAtom = atom<string | null>(null);

const didAtom = atom<string | null>(null);

const chainIdAtom = atom<string | null>(null);

const connectorAtom = atom<BaseConnector | null>(null);

export { connectedAtom, accountAtom, didAtom, chainIdAtom, connectorAtom };
