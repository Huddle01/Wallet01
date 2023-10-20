export class ClientNotFoundError extends Error {
  name = "ClientNotFoundError";
  constructor(hookName: string) {
    super(
      `Wallet01Client has not been initialised. Please initialise the client to use the ${hookName} hooks.`
    );
  }
}

export class ConnectorNotFoundError extends Error {
  name = "ConnectorNotFoundError";
  constructor({ connectorName }: { connectorName: string }) {
    super(
      `Connector ${connectorName} not found. Please check your Wallet01Client config.`
    );
  }
}

export class NoWalletConnectedError extends Error {
  name = "NoWalletConnectedError";
  constructor({ methodName }: { methodName: string }) {
    super(
      `No wallet connected. Please connect a wallet to use ${methodName} method.`
    );
  }
}

export class UnsupportedFunctionCalledError extends Error {
  name = "UnsupportedFunctionCalledError";
  constructor({
    methodName,
    walletName,
  }: {
    methodName: string;
    walletName: string;
  }) {
    super(
      `Function ${methodName} is not supported by the ${walletName} wallet.`
    );
  }
}
