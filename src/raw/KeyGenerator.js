const fs = require('fs');
const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateSSHKey(algorithm, keySize, password, keyName) {
  const keyType = algorithm === 'rsa' ? 'RSA' : 'ECDSA';
  const outputFile = `${keyName}_${keyType}_${keySize}.key`;

  let command = `ssh-keygen -t ${algorithm} -b ${keySize} -C "${keyName}" -f ${outputFile}`;

  if (password) {
    command += ` -N "${password}"`;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating SSH key: ${error}`);
      return;
    }

    console.log(`SSH key generated: ${outputFile}`);
  });
}

rl.question('Choose algorithm (RSA/ECDSA): ', algorithm => {
  algorithm = algorithm.toLowerCase();
  if (algorithm !== 'rsa' && algorithm !== 'ecdsa') {
    console.error('Invalid algorithm choice.');
    rl.close();
    return;
  }

  let validKeySizes = ['1024', '2048', '4096'];
  if (algorithm === 'ecdsa') {
    validKeySizes = ['256', '384', '521'];
  }

  rl.question(`Choose key size (${validKeySizes.join('/')}): `, keySize => {
    if (!validKeySizes.includes(keySize)) {
      console.error('Invalid key size choice.');
      rl.close();
      return;
    }

    rl.question('Enter a custom key name (without spaces): ', keyName => {
      rl.question('Enter password (or press Enter for no password): ', password => {
        rl.close();
        generateSSHKey(algorithm, keySize, password, keyName);
      });
    });
  });
});