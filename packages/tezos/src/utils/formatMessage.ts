export const formatMessage = (input: string): string => {
  const bytes = Buffer.from(input, "utf8").toString("hex");
  const bytesLength = (bytes.length / 2).toString(16);
  const addPadding = `00000000${bytesLength}`;
  const paddedBytesLength = addPadding.slice(addPadding.length - 8);
  const payloadBytes = "05" + "01" + paddedBytesLength + bytes;

  return payloadBytes;
};
