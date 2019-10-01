import Identifiable from "utils/Identifiable";
import Searchable from "lib/view/Searchable";
import { ReactElement } from "react";
// import Link from '../../Link';
import { OnClickListener } from "lib/view/Viewable";

export type NavProps = {
    activeClassName: string,
    as?: string,
    className?: string,
    href: string,
    naked?: boolean,
    onClick: OnClickListener,
    prefetch?: boolean,
    router: {
        pathname: string,
    }
}

/**
 *
 *
 * @export
 * @class NavItem
 * @implements {Identifiable<String>}
 * @implements {Searchable}
 */

export default class NavItem implements Identifiable<String>, Searchable {


    // constructor(private name: String, private props: NavProps, private newFeature: Boolean = false) { }
    /**
     *
     *
     * @param {{}} args
     * @returns {ReactElement<any>}
     * @memberof NavItem
     */
    onBind(_args: {}): ReactElement<any> {
        return <li>
            {/* <Link >
            {
                this.newFeature ? <span>

                </span>  : ''}
                { this.name}
            </Link> */}
        </li >
    }


    /**
     *
     *
     * @private
     * @type {String}
     * @memberof NavItem
     */
    private id: String = ''
    /**
     *
     *
     * @param {String} t
     * @memberof NavItem
     */
    setId(t: String) {
        this.id = t
    }
    /**
     *
     *
     * @returns {String}
     * @memberof NavItem
     */
    getId(): String {
        return this.id
    }
    /**
     *
     *
     * @param {string} _query
     * @param {{}} [_args]
     * @returns {boolean}
     * @memberof NavItem
     */
    onSearch(_query: string, _args?: {}): boolean {
        throw new Error("Method not implemented.");
    }



}
