import axios from 'axios';
import { FILE_API_URL } from '../api/routes';
import { DecodeBase64Url } from '../utils/Base64';
const { readMessage, decrypt } = require('openpgp');
const CryptoJS = require('crypto-js');

export const processLink = async (decodedMessage) => {
  try {
    const decoded = DecodeBase64Url(decodedMessage);
    const [uid, password] = decoded.split('.');
    const { headers, data } = await getFileFromAPI(`${FILE_API_URL}/${uid}`);
    const binaryData = new Uint8Array(data);
    const encryptedFileName = headers['x-ext'];
    const decryptedFileName = CryptoJS.AES.decrypt(encryptedFileName, password).toString(CryptoJS.enc.Utf8);
    const encryptedMessage = await readMessage({ binaryMessage: binaryData });
    const { data: decrypted } = await decrypt({
      message: encryptedMessage,
      passwords: [password],
      format: 'binary'
    });

    const blob = new Blob([decrypted]);
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = decryptedFileName; // Set the desired filename
    downloadLink.textContent = 'Download Decrypted File';
    downloadLink.style.display = 'none';

    // Append the download link to the DOM
    document.body.appendChild(downloadLink);

    // Simulate a click on the download link to trigger the download
    downloadLink.click();

    // Clean up: remove the download link and revoke the Blob URL
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

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

async function getFileFromAPI(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const headers = response.headers;
  return {
    headers: headers,
    data: response.data
  };
}
