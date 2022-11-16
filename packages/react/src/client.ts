import { Client as C } from '@wallet01/core';
import { Getter, Setter } from 'jotai';
import { addressAtom, connectedAtom } from './store/clientStore';

export type Config = {
  autoConnect?: Client['autoConnect'];
  connectors: Client['connectors'];
};

class Client extends C {
  get: Getter;
  set: Setter;

  constructor({ autoConnect, connectors }: Config, get: Getter, set: Setter) {
    console.log('INIALIZING CLIENT');

    super({ autoConnect, connectors });

    this.get = get;
    this.set = set;

    this.on('connect', data => {
      console.log({ data });
      set(addressAtom, data.address);
      set(connectedAtom, true);
    });
  }
}

export default Client;
