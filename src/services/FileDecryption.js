import axios from 'axios';
// const { readMessage, decrypt } = require('openpgp');
const CryptoJS = require('crypto-js');

export const processLink = async (decodedMessage) => {
  try {
    // Extract UID and Password from the base64 value in the link
    // const base64 = link.substring(link.lastIndexOf('/') + 1);
    const decoded = decodeBase64Url(decodedMessage);
    const [uid, password] = decoded.split('.');

    // Download the encrypted file from the API
    const fileUrl = `http://155.4.109.218:7777/file/${uid}`;
    const { headers, data } = await getFileFromAPI(fileUrl);
    console.log(headers);
    const encryptedFileName = headers['x-ext'];
    console.log('Encrypted File Name:', encryptedFileName);
    console.log('Password:', password);

    // Decrypt and decode the encrypted file name
    const decryptedFileName = CryptoJS.AES.decrypt(encryptedFileName, password).toString(CryptoJS.enc.Utf8);
    console.log('Decrypted File Name:', decryptedFileName);

    // Create a message from the encrypted data
    const encryptedMessage = await readMessage({ binaryMessage: data });

    // Decrypt the message with the password
    const { data: decrypted } = await decrypt({
      message: encryptedMessage,
      passwords: [password],
      format: 'binary'
    });

    // Save the decrypted data to a file
    const fileName = `decrypted-${decryptedFileName}`;
    writeFileSync(fileName, decrypted, 'binary');
    console.log('PDF file encrypted and decrypted successfully.');
    const fileSize = getFileSize(fileName);
    console.log('File Size (KB):', fileSize.kilobytes);
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

function decodeBase64Url(base64Url) {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  const paddedBase64 = padding === 0 ? base64 : base64 + '==='.slice(padding);
  return atob(paddedBase64);
}
async function getFileFromAPI(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const headers = response.headers;
  return {
    headers: headers,
    data: response.data
  };
}
