import { TEXT_API_URL } from '../api/routes';
import axios from 'axios';
import { EncodeBase64Url } from '../utils/Base64';

const { createMessage, encrypt } = require('openpgp');

export const generateRandomPassword = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

export const encryptMessage = async (data, password) => {
  try {
    const message = await createMessage({ text: data });
    return await encrypt({ message, passwords: [password] });
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};

export const EncryptText = async (message, validity, password) => {
  try {
    const encrypted = await encryptMessage(message, password);
    const payload = {
      once: validity === 'once',
      message: JSON.stringify(encrypted),
      expiration: validity === 'once' ? 0 : parseInt(validity)
    };

    const response = await axios.post(TEXT_API_URL, payload);

    if (response.data.status === 'success') {
      const uid = response.data.data.uid;
      return {
        decryptedLink: EncodeBase64Url(uid, password)
      };
    } else {
      throw new Error('Status is not success');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
