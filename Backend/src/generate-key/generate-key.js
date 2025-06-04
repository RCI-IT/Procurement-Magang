const crypto = require('crypto');
const fs = require('fs');

// Generate RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

console.log('Public Key:', publicKey);
console.log('Private Key:', privateKey);

// Simpan ke file
fs.writeFileSync('public.pem', publicKey);
fs.writeFileSync('private.pem', privateKey);
console.log('\nRSA keys saved to public.pem and private.pem');