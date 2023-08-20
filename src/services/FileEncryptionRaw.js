const { createMessage, encrypt, readMessage, decrypt } = require('openpgp');
const { readFileSync, statSync } = require('fs');
const { post } = require('axios');
const CryptoJS = require('crypto-js');

const filePath = process.argv[2];
const randomPIN = process.argv[3];

const generateRandomPassword = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

const getFileSize = (filePath) => {
  const stats = statSync(filePath);
  const fileSizeInBytes = stats.size;
  const fileSizeInKB = fileSizeInBytes / 1024;
  const fileSizeInMB = fileSizeInKB / 1024;
  return {
    kilobytes: fileSizeInKB
  };
};

(async () => {
  try {
    const password = generateRandomPassword(32); // Set the password for encryption
    console.log('Password: ', password);
    // Read the PDF file as Uint8Array
    const sourceFilePath = filePath;

    //TODO: 1. Fetch the file from file system (upload binary file) -
    const pdfFile = readFileSync(sourceFilePath); // this returns a buffer
    const sourceFileSize = getFileSize(sourceFilePath);
    console.log('Source File size: ', sourceFileSize.kilobytes, 'KB');
    // console.log('source file: ', pdfFile);

    //TODO:2. Convert the buffer to binary
    const pdfData = new Uint8Array(pdfFile);
    // console.log('PDF data: ', pdfData); // Uint8Array

    // TODO: 3. Create a message from binary data
    // Create a message from the PDF data
    const message = await createMessage({ binary: pdfData });

    // Encrypt the message with the password
    console.log('message: ', message);

    // TODO: 4. Encrypt the message with the password
    const encrypted = await encrypt({
      message: message,
      passwords: [password],
      format: 'binary'
    });
    console.log('Encrypted: ', encrypted); // Uint8Array

    // TODO: 5. Prepare the payload to send to the API
    console.log('Sending encrypted data to the API...');
    const apiUrl = 'http://155.4.109.218:7777/file'; // Replace with the actual API URL

    // TODO: 5.1 Prepare the headers
    // Get file name from the path
    // TODO: 5.1.1 Encrypt the file name
    const lastSlashIndex = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
    const fileName = lastSlashIndex !== -1 ? filePath.slice(lastSlashIndex + 1) : filePath;
    const encryptedFileName = CryptoJS.AES.encrypt(fileName, password).toString();
    // console.log('Encrypted file name: ', encryptedFileName); // Outputs: filename.txt
    const options = {
      hostname: '155.4.109.218',
      port: 7777,
      path: apiUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-EXT': encryptedFileName,
        'X-EXP': 3600
      }
    };

    // TODO: 6. Send the encrypted data to the API
    await post(apiUrl, encrypted, options)
      .then((response) => {
        const uid = response.data.uid;
        console.log(`uid: ${response.data.uid}`);
        const link = Buffer.from(uid + '.' + password).toString('base64');
        console.log(`Link: http://localhost/f/d/${link}`);
        // if (randomPIN !== undefined && randomPIN.toString().length === 6) {
        //     console.log('PIN:', randomPIN);
        //     const encryptedLink = CryptoJS.AES.encrypt(link, randomPIN.toString()).toString().replace(/=/g, '');
        //     console.log('Encrypted Link: ', 'http://localhost/f/d/p/' + encryptedLink);
        //     console.log('Decrypted Link: ', CryptoJS.AES.decrypt(encryptedLink, randomPIN.toString()).toString(CryptoJS.enc.Utf8));
        // }
      })
      .catch((error) => {
        console.error(error);
      });
    console.log('Encrypted data sent to the API.');
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
