/**
 *
 *
 * @class Envelope
 * @template T
 */
export class Envelope<T> {
    /**
     *Creates an instance of Envelope.
     * @param {new () => T} t
     * @memberof Envelope
     */
    constructor(private t: new (any?) => T, private args = undefined) {}
    /**
     *
     *
     * @returns {T}
     * @memberof Envelope
     */
    get = (): T => new this.t(this.args);
    
  }
  
  /**
   * registry of all the services
   *
   * @export
   * @class Registry
   */
  export default class Registry {
    /**
     *
     *
     * @static
     * @type {{}}
     * @memberof Registry
     */
    static repos: {} | undefined = undefined;
    /**
     *
     *
     * @static
     * @memberof Registry
     */
    static setup() {
      this.repos = {};
    }
    /**
     *
     *
     * @static
     * @template T
     * @param {string} key
     * @returns {(T | undefined)}
     * @memberof Registry
     */
    static instance<T>(key: string): T | undefined {
      try {
        if (Registry.repos === undefined) this.setup();
        return Registry.repos[key];
      } catch (error) {
        return undefined;
      }
    }
    /**
     *
     *
     * @static
     * @template T
     * @param {T} t
     * @param {string} name
     * @returns {T}
     * @memberof Registry
     */
    static create<T>(t: T, name: string): T {
      var repo = this.instance(name);
      if (repo !== undefined) return repo as T;
      repo = t;
      this.repos[name] = repo;
      return repo as T;
    }
    /**
     *
     *
     * @static
     * @template T
     * @param {new () => T} t
     * @returns {T}
     * @memberof Registry
     */
    static of<T>(t: new (any?) => T, args = undefined): T {
      var repo = this.instance(t.name);
      if (repo !== undefined) return repo as T;
      const envelope = new Envelope(t, args);
      repo = envelope.get();
      this.repos[t.name] = repo;
      return repo as T;
    }
    /**
     *
     *
     * @static
     * @memberof Registry
     */
    static clear() {}
  }
  