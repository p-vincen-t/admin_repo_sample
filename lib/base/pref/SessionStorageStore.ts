import PrefStore, { EncryptDecrypt } from "stores/PrefStore";

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

  constructor() {}
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
    sessionStorage.setItem(key, v);
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
    let v = sessionStorage.getItem(key);
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
    sessionStorage.removeItem(key);
  }
  /**
   *
   *
   * @memberof CookieStore
   */
  clearAll(): void {
    sessionStorage.clear();
  }
}

const SessionStorageStore = new Store()

export default SessionStorageStore
