// import { Client, createClient } from './client';
import Client from "./client/client";
import { useStore, getState, setState } from "./store/rootStore";

import { BaseConnector } from "./types/BaseConnector";

import setLastUsedConnector from "./utils";

export { Client, BaseConnector, setLastUsedConnector };

export { useStore, getState, setState };
