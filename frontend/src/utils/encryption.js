import CryptoJS from "crypto-js";
import instance from "../../env";

const key = instance().ENCRYPT_DECRYPT_KEY;
const iv = instance().IV;

export function encryptData (val) {
    let parsedKey = CryptoJS.enc.Hex.parse(key);
    let parsediv = CryptoJS.enc.Hex.parse(iv);
    let encryptedData = null;
    if(val == null || val == '')    return null;
    encryptedData = CryptoJS.AES.encrypt(val.toString(),parsedKey,{iv:parsediv});
    // console.log('encryptedData', encryptedData);
    let ciphertext = encryptedData.ciphertext;
    let encryptedString = ciphertext.toString();
    return encryptedString;
}

export function decryptData (val) {
    let parsedKey = CryptoJS.enc.Hex.parse(key);
    let parsediv = CryptoJS.enc.Hex.parse(iv);
    // console.log({ parsedKey, parsediv, val });
    if(val == null || val == '')    return;
    let ciphertext = CryptoJS.enc.Hex.parse(val.toString());
    // console.log(ciphertext);
    let decryptedData = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        parsedKey,
        {iv:parsediv}
    );
    let decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
    // console.log('decryptedText', val, decryptedText);
    return decryptedText;
}