// import { AES } from "crypto-js";
import { EncryptDecrypt } from 'stores/PrefStore'
import PrefStore from "stores/PrefStore";
export const DEVICE_KEY = "xrd_id";
// var crypto = require('crypto');

// const md5 = data => crypto.createHash('md5').update(data).digest("hex");
/**
 * default implementation of cookie store
 *
 * @export
 * @class CookieStore
 * @implements {PrefStore}
 */
class Store implements PrefStore {
  /**
   *Creates an instance of LocalStorageStore.
   * @memberof LocalStorageStore
   */
  constructor(){}
  /**
   *
   *
   * @param {String} key
   * @param {*} t
   * @param {({}| undefined)} [_args=undefined]
   * @memberof CookieStore
   */
  put(key: string, t: any, _args: {} | undefined = undefined) {
    let v = EncryptDecrypt.encrypt(key, t);
    localStorage.setItem(key, v);
  }
  /**
   *
   *
   * @param {String} key
   * @param {{}} [args]
   * @returns
   * @memberof CookieStore
   */
  get(key: string, _args?: {}): any | undefined {
    let v = localStorage.getItem(key);
    if (v) return EncryptDecrypt.decrypt(key, v);
    return undefined;
  }
  /**
   *
   *
   * @param {String} key
   * @memberof CookieStore
   */
  clear(key: string): void {
    localStorage.removeItem(key);
  }
  /**
   *
   *
   * @memberof CookieStore
   */
  clearAll(): void {
    localStorage.clear();
  }
}

const LocalStoreStore = new Store()

export default LocalStoreStore
