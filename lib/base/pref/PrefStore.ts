
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
