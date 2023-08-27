import axios from 'axios';
import { TEXT_API_URL } from '../api/routes';
import { DecodeBase64Url } from '../utils/Base64';

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
    console.log('link', link);
    const base64 = link.substring(link.lastIndexOf('/') + 1);
    console.log('base64', base64);
    const decoded = DecodeBase64Url(base64);
    console.log('decoded', decoded);
    const [uid, password] = decoded.split('.');
    console.log('uid', uid);
    console.log('password', password);
    return await decryptMessage(uid, password);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const decryptMessage = async (uid, password) => {
  try {
    const format = 'utf8';
    const { data } = await axios.get(`${TEXT_API_URL}/${uid}`);
    const encryptedMsg = JSON.parse(data.secret.message);
    const message = await readMessage({ armoredMessage: encryptedMsg });
    const decrypted = await decrypt({ message, passwords: [password], format });

    return decrypted.data;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw error;
  }
};
