import { ReactElement } from "react";

/**
 *
 *
 * @export
 * @interface OnClickListener
 */
export interface OnClickListener{
    /**
     *
     *
     * @param {Viewable<I, T>} v
     * @param {{}} [args]
     * @memberof OnClickListener
     */
    onClick(v: Viewable, args?:{})
}
/**
 *
 *
 * @export
 * @interface Viewable
 */
export default interface Viewable {
  /**
   *
   *
   * @param {{}} args
   * @returns {ReactElement}
   * @memberof Viewable
   */
  onBind(args: {}): ReactElement
}