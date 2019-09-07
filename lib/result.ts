/**
 *
 *
 * @class CallBack
 * @template T
 */
class CallBack<T> {
    /**
     *
     *
     * @private
     * @memberof CallBack
     */
    private r: ((t: T) => void) | undefined = undefined
    /**
     *
     *
     * @private
     * @memberof CallBack
     */
    private e: ((e: Error) => void) | undefined = undefined
    /**
     *
     *
     * @param {T} t
     * @memberof CallBack
     */
    response(t: T) {
        if(this.r !== undefined) {
            try {
                this.r(t)
            } catch (error) {
                this.error(error)
            }
        }
        else throw new Error("response callback not set")
    }
    /**
     *
     *
     * @template E
     * @param {E} e
     * @memberof CallBack
     */
    error<E extends Error>(e: E) {
        if(this.e !== undefined) {
            try {
                this.e(e)
            } catch (error) {
                
            }
        }
        else throw new Error("error callback not set")
    }
    /**
     *
     *
     * @param {(t: T) => void} r
     * @returns {CallBack<T>}
     * @memberof CallBack
     */
    responseCallBack(r: (t: T) => void): CallBack<T> {
        this.r = r
        return this
    }
    /**
     *
     *
     * @param {(t: Error) => void} e
     * @returns {CallBack<T>}
     * @memberof CallBack
     */
    errorCallBack(e: (t: Error) => void): CallBack<T> {
        this.e = e
        return this
    }
}


export default CallBack;