import crypto from "crypto"

export const EncryptDecrypt = {
    encrypt: (key, data): string => {
        let cipher = crypto.createCipher('aes-256-cbc', key);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    decrypt: (key, encrypted_data): string => {
        let decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(encrypted_data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}


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
    put(key: String, t: any, args?: {}|undefined): any
    /**
     *
     *
     * @param {String} key
     * @param {({}|undefined)} [args]
     * @returns {*}
     * @memberof PrefStore
     */
    get(key: String, args?: {}|undefined): any
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