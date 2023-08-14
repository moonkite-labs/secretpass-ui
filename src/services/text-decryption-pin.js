const { readFileSync } = require('fs');
const CryptoJS = require('crypto-js');

const decryptLink = (encryptedLink, pin) => {
    try {
        // Extract the encrypted portion from the link
        const encryptedLinkWithoutPrefix = encryptedLink.replace('http://localhost/t/d/p/', '');
        console.log('Encrypted Link Without Prefix:', encryptedLinkWithoutPrefix);

        // Attempt to decrypt the extracted link using the provided PIN
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedLinkWithoutPrefix, pin);
        const decryptedLink = decryptedBytes.toString(CryptoJS.enc.Utf8);
        console.log('Decrypted Link:', decryptedLink);

        // Check if decryption was successful
        if (decryptedLink) {
            console.log('Goto:', 'http://localhost/t/d/' + decryptedLink);
        } else {
            console.error('Decryption failed. PIN may be incorrect.');
        }
    } catch (error) {
        // Handle decryption error
        console.error('An error occurred during decryption:', error);
    }
};

const readEncryptedLinkFromOutputFile = (filePath, key) => {
    try {
        const content = readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.trim().startsWith(key)) {
                const startIndex = line.indexOf(':') + 1;
                return line.substring(startIndex).trim();
            }
        }
        return null; // Key not found in the file
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
};

const pin = '360159'
const encryptedLink = readEncryptedLinkFromOutputFile('output.txt', 'Encrypted Link')
console.log('Encrypted Link: ', encryptedLink)
decryptLink(encryptedLink, pin)