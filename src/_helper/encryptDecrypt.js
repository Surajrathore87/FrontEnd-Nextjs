const CryptoJS = require('crypto-js');
const keys = '000102030405060708090a0b0c0d0e0f';
// encrypt
export function encrypt(data) {
  // Encrypt
  // var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), 'Se5ZfFTzJ36PH7T6').toString();
  const key = CryptoJS.enc.Utf8.parse(keys);
  const iv = CryptoJS.enc.Utf8.parse(keys);
  const value = JSON.stringify(data);
  const encryptData = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(value.toString()),
    key,
    {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );
  return encryptData.toString();
}

// decrypt
export function decrypt(data) {
  // Decrypt
  // var bytes = CryptoJS.AES.decrypt(data, 'Se5ZfFTzJ36PH7T6');
  // var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  const key = CryptoJS.enc.Utf8.parse(keys);
  const iv = CryptoJS.enc.Utf8.parse(keys);
  const decrypted = CryptoJS.AES.decrypt(data, key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const stringData = decrypted.toString(CryptoJS.enc.Utf8);
  let decryptedData;
  if (stringData) {
    decryptedData = JSON.parse(stringData);
  } else {
    decryptedData = null;
  }
  return decryptedData;
}
