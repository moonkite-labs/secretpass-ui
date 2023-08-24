// import axios from 'axios';
// const { readMessage, decrypt } = require('openpgp');
const CryptoJS = require('crypto-js');

export const validatePin = (code, encryptedLink) => {
  const pinNumber = Object.values(code).join('');

  try {
    const decryptedLink = CryptoJS.AES.decrypt(encryptedLink, pinNumber).toString(CryptoJS.enc.Utf8);

    return {
      decryptedLink: decryptedLink,
      status: 'success'
    };
  } catch (error) {
    console.error('Decryption error:', error);
    return {
      decryptedLink: null,
      status: 'error'
    };
  }
};
