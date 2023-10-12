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

export class UnsupportedChainError extends Error {
  name = "UnsupportedChainError";
  chainId: string;

  constructor({ chainId }: { chainId: string }) {
    super(`ChainId: ${chainId} is not supported`);
    this.chainId = chainId;
  }
}

export class WalletCreationError extends Error {
  name = "WalletCreationError";

  constructor({ walletName }: { walletName: string }) {
    super(`Error while creating ${walletName} wallet.`);
  }
}

export class MessageSignError extends Error {
  name = "MessageSignError";

  constructor({ walletName }: { walletName: string }) {
    super(`Error while signing message with ${walletName} wallet.`);
  }
}

export class UnrecognisedChainError extends Error {
  name = "UnrecognisedChainError";

  constructor({
    walletName,
    chainId,
  }: {
    walletName: string;
    chainId: string;
  }) {
    super(
      `Unrecognised chainId ${chainId} provided. Please provide options to add chain to ${walletName} wallet.`
    );
  }
}

export class AddressNotFoundError extends Error {
  name = "AddressNotFoundError";
  constructor({ walletName }: { walletName: string }) {
    super(`Address not found in ${walletName} wallet.`);
  }
}

export class WalletNotInstalledError extends Error {
  name = "WalletNotInstalledError";

  constructor({ walletName }: { walletName: string }) {
    super(`${walletName} wallet is not installed.`);
  }
}
