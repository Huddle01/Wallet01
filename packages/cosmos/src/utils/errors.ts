export class AddressNotFoundError extends Error {
  name = "AddressNotFoundError";
  constructor({ walletName }: { walletName: string }) {
    super(`Address not found in ${walletName} wallet.`);
  }
}
