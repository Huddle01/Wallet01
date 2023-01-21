import { char2Bytes } from "@taquito/utils";

export const formatMessage = (input: string): string => {
  const bytes = char2Bytes(input);
  const bytesLength = (bytes.length / 2).toString(16);
  const addPadding = `00000000${bytesLength}`;
  const paddedBytesLength = addPadding.slice(addPadding.length - 8);
  const payloadBytes = "05" + "01" + paddedBytesLength + bytes;

  return payloadBytes;
};
