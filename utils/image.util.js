import { v4 as uuidv4 } from "uuid";

const supportedMimes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/svg",
  "image/gif",
  "image/webp",
];

export const imageValidate = (size, mime) => {
  if (bytesToMb(size) < 1) {
    return "Image size must be less than 2 MB";
  } else if (!supportedMimes.includes(mime)) {
    return "Image type must be png, jpg, jpeg, svg, gif or webp !!!";
  }
  return "OK";
};

export const bytesToMb = (bytes) => {
  return bytes / (1024 * 1024);
};

export const newUUID = () => {
  return uuidv4();
};
