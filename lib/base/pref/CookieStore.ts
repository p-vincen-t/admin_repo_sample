import cookie from "js-cookie";
import { EncryptDecrypt } from "./PrefStore";

import PrefStore from "./PrefStore";
import Registry from "../Registry";
export const REFRESH_TOKEN = "sess_id";
// var crypto = require('crypto');

// const md5 = data => crypto.createHash('md5').update(data).digest("hex");
/**
 * default implementation of cookie store
 *
 * @export
 * @class CookieStore
 * @implements {PrefStore}
 */
class CookieStore implements PrefStore {
  /**
   *
   *
   * @param {String} key
   * @param {*} t
   * @param {({}| undefined)} [args=undefined]
   * @memberof CookieStore
   */
  put(key: String, t: any, args: {} | undefined = undefined) {
    let v = EncryptDecrypt.encrypt(key, t);
    if (args !== undefined) {
      cookie.set(key, v, args);
    } else cookie.set(key, v);
  }

  // // Encrypt
  // var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');

  // // Decrypt
  // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
  // var plaintext = bytes.toString(CryptoJS.enc.Utf8);

  /**
   *
   *
   * @param {String} key
   * @param {{}} [args]
   * @returns
   * @memberof CookieStore
   */
  get(key: String, _args?: {}): any | undefined {
    let v = cookie.get(key);
    if (v) {
      let bytes = EncryptDecrypt.decrypt(key, v);
      return bytes;
    }
    return undefined;
  }
  /**
   *
   *
   * @param {String} key
   * @memberof CookieStore
   */
  clear(key: String): void {
    let k = key;
    cookie.remove(k);
  }
  /**
   *
   *
   * @memberof CookieStore
   */
  clearAll(): void {
    cookie.clear();
  }
}

export default Registry.of(CookieStore);
