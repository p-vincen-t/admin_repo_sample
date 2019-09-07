/**
 * identifies an instance of data type
 *
 * @export
 * @interface Identifiable
 * @template T the type class of data
 */
export default interface Identifiable<T> {
    /**
     * inject the identifying info to the type
     *
     * @param {T} t identifying information
     * @memberof Identifiable
     */
    setId(t: T);
    /**
     *obtain the identifying object from this instance of object
     *
     * @returns {T} identifying information
     * @memberof Identifiable
     */
    getId(): T;
}