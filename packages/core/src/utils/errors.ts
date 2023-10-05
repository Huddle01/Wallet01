export class AutoConnectionError extends Error {
  name = "AutoConnectionError";
}

export class ProviderNotFoundError extends Error {
  name = "ProviderNotFoundError";
  walletName: string;

  constructor({ walletName }: { walletName: string }) {
    super();
    this.walletName = walletName;
  }
}

export class WalletConnectionError extends Error {
  name = "WalletConnectionError";
  walletName: string;

  constructor({ walletName }: { walletName: string }) {
    super(`Error while connecting to ${walletName} wallet.`);
    this.walletName = walletName;
  }
}

export class WalletNotConnectedError extends Error {
  name = "WalletNotConnectedError";
  walletName: string;

  constructor({ walletName }: { walletName: string }) {
    super(`${walletName} wallet is not connected.`);
    this.walletName = walletName;
  }
}

export class UnknownError extends Error {
  name = "UnknownError";

  constructor({
    walletName,
    atFunction,
  }: {
    walletName: string;
    atFunction: string;
  }) {
    super(
      `There was an unexpected error while using ${walletName} wallet at ${atFunction}(). Check console for more details.`
    );
  }
}

export class UserRejectedRequestError extends Error {
  name = "UserRejectedRequestError";

  constructor() {
    super(`User rejected the request.`);
  }
}
