//SEND THE ENCRYPTED LINK TO EMAIL WITH PIN
import { EMAIL_API_URL, WEB_TEXT_DECRYPTION_URL_WITH_PIN } from '../api/routes';
import CryptoJS from 'crypto-js';
import axios from 'axios';

export const SendEmail = async (emailData, link) => {
  const randomPIN = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  try {
    const encryptedLink = CryptoJS.AES.encrypt(link, randomPIN.toString()).toString().replace(/=/g, '');
    const payload = {
      sendTo: emailData[0],
      secureLink: WEB_TEXT_DECRYPTION_URL_WITH_PIN + encodeURIComponent(encryptedLink)
    };
    const response = await axios.post(EMAIL_API_URL, payload);
    if (response.data.status === 'success') {
      return { emailSent: true, pin: randomPIN };
    }
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};
