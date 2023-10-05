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
