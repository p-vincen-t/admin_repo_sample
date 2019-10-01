import Identifiable from 'utils/Identifiable';

/**
 *
 *
 * @export
 */
export default class User implements Identifiable<string> {
    /**
     *
     */
    private id: string = '';
    /**
     *
     *
     * @param {String} t
     * @memberof User
     */
    setId(t: string) {
        this.id = t
    }
    /**
     *
     *
     * @returns {String}
     * @memberof User
     */
    getId = (): string => this.id
    /**
     *
     *
     * @type {String}
     * @memberof User
     */
    names?: String

}
