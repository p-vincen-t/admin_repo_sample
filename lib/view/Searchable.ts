import Viewable from "./Viewable";

/**
 *
 *
 * @export
 * @interface Searchable
 * @extends {Viewable}
 */
export default interface Searchable extends Viewable {
    
    /**
     *
     *
     * @param {string} query
     * @param {{}} [args]
     * @returns {boolean}
     * @memberof Searchable
     */
    onSearch(query: string, args?: {}): boolean
}