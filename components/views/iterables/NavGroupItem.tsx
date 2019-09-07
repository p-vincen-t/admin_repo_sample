import Identifiable from "../../../lib/utils/Identifiable";
import Searchable from "../../../lib/view/Searchable";
import { ReactElement } from "react";

/**
 * used to display a group of items
 *
 * @export
 * @class NavGroupItem
 * @implements {Identifiable<String>}
 * @implements {Searchable}
 */
export default class NavGroupItem implements Identifiable<String>, Searchable {
    // private navItems: NavItem[]
    // constructor(private name: String){}
    onSearch(_query: string, _args?: {}): boolean {
        throw new Error("Method not implemented.");
    }
    onBind(_args: {}):ReactElement<any> {
        throw new Error("Method not implemented.");
    }
    setId(_t: String) {
        throw new Error("Method not implemented.");
    }  
      getId(): String {
        throw new Error("Method not implemented.");
    }


}