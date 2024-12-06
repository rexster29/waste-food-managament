var CryptoJS = require("crypto-js");

const decrypt =  (val) => {
    let key = process.env.Encrypt_Decrypt_key
    let iv= process.env.IV
    if(val==null){
        return val
    }
    let parsedKey = CryptoJS.enc.Hex.parse(key);
    let parsedIV = CryptoJS.enc.Hex.parse(iv);
    // console.log('d1',val)
    // Parse the ciphertext
    let ciphertext = CryptoJS.enc.Hex.parse(val);
    // console.log(ciphertext,'after parse')
    // Decrypt the ciphertext using the key and IV
    let decryptedValue = CryptoJS.AES.decrypt({ ciphertext: ciphertext },parsedKey,{ iv: parsedIV });
    // Convert the decrypted bytes to a string
    let decryptedText = decryptedValue.toString(CryptoJS.enc.Utf8);
    // console.log('Decrypted:', decryptedText);
    return decryptedText;
};

module.exports = {
    decrypt
};
