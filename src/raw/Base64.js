

const plainText = 'Hello, World!';
const encoded = function EncodeBase64Url(plainText) {
  return Buffer.from(plainText).toString('base64');
};

const decoded = function DecodeBase64Url(encoded) {
  return Buffer.from(encoded, 'base64').toString('ascii');
};

console.log('plainText', plainText);
console.log('encoded', encoded(plainText));
console.log('decoded', decoded(encoded(plainText)));
