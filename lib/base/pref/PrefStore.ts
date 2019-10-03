// import crypto from "crypto"

let cipher = salt => {
  let textToChars = text => text.split('').map(c => c.charCodeAt(0))
  let byteHex = n => ("0" + Number(n).toString(16)).substr(-2)
  let applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code)    

  return text => text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('')
}

let decipher = salt => {
  let textToChars = text => text.split('').map(c => c.charCodeAt(0))
  // let saltChars = textToChars(salt)
  let applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code)
  return encoded => encoded.match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('')
}
export const EncryptDecrypt = {
  encrypt: (key, data): string => {    
    let cip = cipher(key);
    return cip(data);
    //return key + data
  },
  decrypt: (key, encrypted_data): string => {
    let deci = decipher(key);
    return deci(encrypted_data);
    //return key + encrypted_data
  }
}


/**
 *
 *
 * @export
 * @interface PrefStore
 */
export default interface PrefStore {
  /**
   *
   *
   * @param {String} key
   * @param {*} t
   * @param {({}|undefined)} [args]
   * @returns {*}
   * @memberof PrefStore
   */
  put(key: String, t: any, args?: {} | undefined): any
  /**
   *
   *
   * @param {String} key
   * @param {({}|undefined)} [args]
   * @returns {*}
   * @memberof PrefStore
   */
  get(key: String, args?: {} | undefined): any
  /**
   *
   *
   * @param {String} key
   * @memberof PrefStore
   */
  clear(key: String): void
  /**
   *
   *
   * @memberof PrefStore
   */
  clearAll(): void
}
