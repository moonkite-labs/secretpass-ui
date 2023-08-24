const { decrypt, readMessage } = require('openpgp');
const { readFileSync, writeFileSync, statSync } = require('fs');
const axios = require('axios');
const CryptoJS = require('crypto-js');

const readLinkFromOutputFile = (filePath) => {
  const content = readFileSync(filePath, 'utf8');
  const linkStartIndex = content.indexOf('Link: ') + 6;
  const linkEndIndex = content.indexOf('\n', linkStartIndex);
  return content.slice(linkStartIndex, linkEndIndex).trim();
};

const getFileSize = (filePath) => {
  const stats = statSync(filePath);
  const fileSizeInBytes = stats.size;
  const fileSizeInKB = fileSizeInBytes / 1024;
  return {
    kilobytes: fileSizeInKB
  };
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

async function processLink(link) {
  try {
    // Extract UID and Password from the base64 value in the link
    const base64 = link.substring(link.lastIndexOf('/') + 1);
    const decoded = decodeBase64Url(base64);
    const [uid, password] = decoded.split('.');

    // Download the encrypted file from the API
    const fileUrl = `http://155.4.113.208:7777/file/${uid}`;
    const { headers, data } = await getFileFromAPI(fileUrl);
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
}

const link = readLinkFromOutputFile('output.txt');
processLink(link);
