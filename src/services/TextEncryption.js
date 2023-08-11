const { createMessage, encrypt } = require('openpgp');
import axios from 'axios';
import { Buffer } from 'buffer';
// import CryptoJS from 'crypto-js'; // Correct CryptoJS import

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
    // const randomPIN = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    const encrypted = await encryptMessage(message, password);

    console.log('Data Length :', message.length);
    console.log('Password:', password);

    const payload = {
      once: validity == 'once' ? true : false,
      message: JSON.stringify(encrypted),
      expiration: validity
    };

    console.log(payload);

    const response = await axios.post('http://155.4.113.208:7777/secret', payload);

    if (response.data.status === 'success') {
      console.log('SUCCESSFUL');
      const uid = response.data.data.uid;
      console.log('UID:', uid);
      const link = Buffer.from(uid + '.' + password).toString('base64');

      console.log('Link:', 'http://localhost/t/d/' + link);
      // console.log('PIN:', randomPIN);
      // const encryptedLink = CryptoJS.AES.encrypt(link, randomPIN.toString()).toString().replace(/=/g, '');
      // console.log('Encrypted Link: ', 'http://localhost/t/d/p/' + encryptedLink);
      // console.log('Decrypted Link: ', CryptoJS.AES.decrypt(encryptedLink, randomPIN.toString()).toString(CryptoJS.enc.Utf8));

      return 'http://localhost:3000/t/d/' + link;
      // =======
      //       console.log('Link:', 'http://localhost:3000/t/d/' + link);
      //       console.log('PIN:', randomPIN);
      //       const encryptedLink = CryptoJS.AES.encrypt(link, randomPIN.toString()).toString().replace(/=/g, '');
      //       console.log('Encrypted Link: ', 'http://localhost:3000/t/d/p/' + encryptedLink);
      //       console.log('Decrypted Link: ', CryptoJS.AES.decrypt(encryptedLink, randomPIN.toString()).toString(CryptoJS.enc.Utf8));
      //       const encodedMessage = encodeURIComponent(encryptedLink); // Encode the message
      //       return 'http://localhost:3000/t/d/p/' + encodedMessage;
      // >>>>>>> 0bdec9f907ada7073b2cc68764735b1237dc6f2d
    } else {
      console.log('Status is not success');
      throw new Error('Status is not success');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
