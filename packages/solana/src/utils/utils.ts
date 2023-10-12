import { UnknownError, UserRejectedRequestError } from "@wallet01/core";

export class WalletInternalError extends Error {
  name = "WalletInternalError";

  constructor({ walletName }: { walletName: string }) {
    super(`There was an internal error while using ${walletName} wallet.`);
  }
}

export class UnauthorisedMethodError extends Error {
  name = "UnauthorisedMethodError";

  constructor({ method, walletName }: { method: string; walletName: string }) {
    super(
      `Method ${method} is not authorised by the user for ${walletName} wallet.`
    );
  }
}

export const SolanaErrorHandler = (
  error: any,
  atFunction: string,
  walletName: string
) => {
  switch (error.code) {
    case 4100:
      throw new UnauthorisedMethodError({
        method: atFunction,
        walletName,
      });

    case 4001:
      throw new UserRejectedRequestError();

    case -32603:
      throw new WalletInternalError({ walletName });

    default:
      throw new UnknownError({
        walletName,
        atFunction,
      });
  }
};
