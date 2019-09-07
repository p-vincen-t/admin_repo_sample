import Identifiable from "../../../lib/utils/Identifiable";
import Searchable from "../../../lib/view/Searchable";
import { ReactElement } from "react";

export default class NavCategoryGroup implements Identifiable<String>, Searchable {
    onSearch(_query: string, _args?: {}): boolean {
        throw new Error("Method not implemented.");
    }
    onBind(_args: {}): ReactElement<any> {
        throw new Error("Method not implemented.");
    }
    setId(_t: String) {
        throw new Error("Method not implemented.");
    }  
      getId(): String {
        throw new Error("Method not implemented.");
    }


}