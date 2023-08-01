export enum SigningType {
  RAW = "raw",
  OPERATION = "operation",
  MICHELINE = "micheline",
}

export enum PermissionScope {
  SIGN = "sign",
  OPERATION_REQUEST = "operation_request",
  ENCRYPT = "encrypt",
  NOTIFICATION = "notification",
  THRESHOLD = "threshold",
}

export enum NetworkType {
  MAINNET = "mainnet",
  GHOSTNET = "ghostnet",
  MONDAYNET = "mondaynet",
  DAILYNET = "dailynet",
  DELPHINET = "delphinet",
  EDONET = "edonet",
  FLORENCENET = "florencenet",
  GRANADANET = "granadanet",
  HANGZHOUNET = "hangzhounet",
  ITHACANET = "ithacanet",
  JAKARTANET = "jakartanet",
  KATHMANDUNET = "kathmandunet",
  LIMANET = "limanet",
  MUMBAINET = "mumbainet",
  CUSTOM = "custom",
}

export type Networks = (typeof NetworkType)[keyof typeof NetworkType];

export enum ColorMode {
  LIGHT = "light",
  DARK = "dark",
}

export interface DAppClientOptions {
  /**
   * Name of the application
   */
  name: string;
  /**
   * Description of the application
   */
  description?: string;
  /**
   * A URL to the icon of the application
   */
  iconUrl?: string;
  /**
   * A URL to the website of the application
   */
  appUrl?: string;
  /**
   * Indicates on which network the DApp is planning to run. This is currently used to adjust the URLs of web-wallets in the pairing alert if they use different URLs for testnets.
   * You will still have to define the network you intend to use during the permission request.
   */
  preferredNetwork?: NetworkType;
  /**
   * Set the color mode for the UI elements (alerts and toasts)
   */
  colorMode?: ColorMode;
  /**
   * A disclaimer text that will be displayed in the pairing alert
   */
  disclaimerText?: string;
  /**
   * The wallets that will be featured in the UI.
   */
  featuredWallets?: string[];
}
