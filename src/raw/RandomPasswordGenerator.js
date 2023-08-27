const RandomPasswordGenerator = (length, options) => {
  const optionsMap = {
    upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowerCase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_-+=<>?/{}~',
    vowel: 'AEIOUaeiou',
    consonant: 'BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz'
  };

  let characters = '';
  options.forEach((option) => {
    characters += optionsMap[option];
  });

  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

// Usage examples
const options1 = ['upperCase', 'lowerCase', 'numbers', 'symbols'];
const passwordWithOptions1 = RandomPasswordGenerator(16, options1);
console.log(passwordWithOptions1);

const options2 = ['lowerCase', 'numbers', 'vowel', 'consonant'];
const passwordWithMoreOptions = RandomPasswordGenerator(32, options2);
console.log(passwordWithMoreOptions);
