/**
 *
 *
 * @export
 * @class AuthError
 */
export class AuthError {
    /**
     *
     *
     * @static
     * @memberof AuthError
     */
    static ACCOUNT_NOT_FOUND = 1;
    /**
     *
     *
     * @static
     * @memberof AuthError
     */
    static WRONG_PASSWORD = 2;   
    /**
     *Creates an instance of AuthError.
     * @param {number} noteId
     * @memberof AuthError
     */
    constructor(public noteId: number) {}
}

export class AppError {
    /**
     *
     *
     * @static
     * @memberof AuthError
     */
    static API_VALIDATION_ERROR = 1;
    /**
     *
     *
     * @static
     * @memberof AuthError
     */
    static APP_CRUSH_ERROR = 2;   
    /**
     *Creates an instance of AuthError.
     * @param {number} noteId
     * @memberof AuthError
     */
    constructor(public noteId: number) {}
}