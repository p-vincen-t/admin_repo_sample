import Identifiable from "../utils/Identifiable";
/**
 *
 *
 * @export
 * @class User
 * @implements {Identifiable<String>}
 */
export default class User implements Identifiable<String> {
    /**
     *
     *
     * @private
     * @type {String}
     * @memberof User
     */
    private id: String = '';
    /**
     *
     *
     * @param {String} t
     * @memberof User
     */
    setId(t: String) {
        this.id = t
    }
    /**
     *
     *
     * @returns {String}
     * @memberof User
     */
    getId = (): String => this.id
    /**
     *
     *
     * @type {String}
     * @memberof User
     */
    names?: String

}