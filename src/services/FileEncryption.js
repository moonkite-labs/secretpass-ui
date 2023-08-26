import {FILE_API_URL, WEB_FILE_DECRYPTION_URL} from '../api/routes';
import {Buffer} from 'buffer';
import {EncodeBase64Url} from "../utils/Base64";

const { createMessage, encrypt } = require('openpgp');
const CryptoJS = require('crypto-js');

const generateRandomPassword = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

export const FileEncryption = async (file) => {
  const password = generateRandomPassword(32);

  try {
    const encryptedData = await EncryptFile(file, password);

    // Prepare and send the encrypted data to the API
    const encryptedFileName = CryptoJS.AES.encrypt(file.name, password).toString();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-EXT': encryptedFileName,
        'X-EXP': 3600
      },
      body: encryptedData // The encrypted data to be sent
    };

    const response = await fetch(FILE_API_URL, options);
    const responseData = await response.json(); // Assuming the API returns JSON
    const uid = responseData.uid;
    return WEB_FILE_DECRYPTION_URL + EncodeBase64Url(uid, password);
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

const EncryptFile = (file, password) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = new Uint8Array(event.target.result);
      createMessage({ binary: fileData })
        .then((message) => {
          return encrypt({
            message: message,
            passwords: [password],
            format: 'binary'
          });
        })
        .then((encrypted) => {
          resolve(encrypted);
        })
        .catch((error) => {
          reject(error);
        });
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};
