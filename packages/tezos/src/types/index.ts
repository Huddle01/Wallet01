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
