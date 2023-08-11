const axios = require('axios');
const { readMessage, decrypt } = require('openpgp');
const { readFileSync } = require('fs');

const decryptMessage = async (uid, password) => {
  try {
    const format = 'utf8';
    const { data } = await axios.get('http://155.4.113.208:7777/secret/' + uid);
    // console.log('Response payload: ', data)
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

async function processLink(link) {
  try {
    // Extract UID and Password from the base64 value in the link
    const base64 = link.substring(link.lastIndexOf('/') + 1);
    const decoded = decodeBase64Url(base64);
    const [uid, password] = decoded.split('.');

    // Decrypt the message
    const decryptedMessage = await decryptMessage(uid, password);
    console.log('Decrypted Message: ', decryptedMessage);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const readLinkFromOutputFile = (filePath) => {
  const content = readFileSync(filePath, 'utf8');
  const linkStartIndex = content.indexOf('Link: ') + 6;
  const linkEndIndex = content.indexOf('\n', linkStartIndex);
  return content.slice(linkStartIndex, linkEndIndex).trim();
};

function decodeBase64Url(base64Url) {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  const paddedBase64 = padding === 0 ? base64 : base64 + '==='.slice(padding);
  return atob(paddedBase64);
}

const link = readLinkFromOutputFile('output.txt');
processLink(link);
