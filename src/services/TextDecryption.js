import axios from 'axios';
const { readMessage, decrypt } = require('openpgp');
const CryptoJS = require('crypto-js');

export const validatePin = (code, encryptedLink) => {
  const concatenatedString = Object.values(code).join('');
  const decryptedLink = CryptoJS.AES.decrypt(encryptedLink, concatenatedString.toString()).toString(CryptoJS.enc.Utf8);
  return {
    decryptedLink: decryptedLink,
    status: 'success'
  };

};

export const processLink = async (link) => {
  try {
    // Extract UID and Password from the base64 value in the link
    const base64 = link.substring(link.lastIndexOf('/') + 1);
    const decoded = decodeBase64Url(base64);
    const [uid, password] = decoded.split('.');

    // Decrypt the message
    const decryptedMessage = await decryptMessage(uid, password);
    return decryptedMessage;
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const decryptMessage = async (uid, password) => {
  try {
    const format = 'utf8';
    const { data } = await axios.get('http://155.4.113.208:7777/secret/' + uid);
    const encryptedMsg = JSON.parse(data.secret.message);
    console.log('Encrypted Message: ', encryptedMsg);
    const message = await readMessage({ armoredMessage: encryptedMsg });
    const decrypted = await decrypt({ message, passwords: [password], format });
    console.log('Decrypted Message: ', decrypted.data);
    return decrypted.data;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};

function decodeBase64Url(base64Url) {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  const paddedBase64 = padding === 0 ? base64 : base64 + '==='.slice(padding);
  return atob(paddedBase64);
}
