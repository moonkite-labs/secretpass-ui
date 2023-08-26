import {Buffer} from "buffer";

export function DecodeBase64Url(base64Url) {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  const paddedBase64 = padding === 0 ? base64 : base64 + '==='.slice(padding);
  return atob(paddedBase64);
}

export function EncodeBase64Url(uid, password) {
  return Buffer.from(uid + '.' + password).toString('base64');
}