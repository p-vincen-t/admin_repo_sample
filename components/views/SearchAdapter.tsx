import Searchable from "../../lib/view/Searchable";
import { Component, cloneElement, ReactElement } from "react";
import PropTypes from "prop-types";
import { OnClickListener } from "../../lib/view/Viewable";

/**
 *
 *
 * @export
 * @class SearchAdapter
 * @extends {Component<{
 *     parentNode?: JSX.Element,
 *     childNode?: JSX.Element
 * }, { items: T[] }>}
 * @template T
 */
class SearchAdapter<T extends Searchable> extends Component<{
    onClick?: OnClickListener,
    parentNode?: JSX.Element,
    childNode?: JSX.Element
}, { items: T[] }> {

    /**
     *
     *
     * @memberof SearchAdapter
     */
    state = {
        items: []
    }
    /**
     *
     *
     * @static
     * @type {{}}
     * @memberof SearchAdapter
     */
    static propTypes: {};
    /**
     *
     *
     * @static
     * @type {{ parentNode: JSX.Element; childNode: JSX.Element; }}
     * @memberof SearchAdapter
     */
    static defaultProps: { parentNode: JSX.Element; childNode: JSX.Element; };
    /**
     *Creates an instance of SearchAdapter.
     * @param {*} props
     * @param {T[]} [items=Array()]
     * @memberof SearchAdapter
     */
    constructor(props, items: T[] = Array()) {
        super(props)
        this.state.items = items
    }
    /**
     *
     *
     * @param {T} t
     * @memberof SearchAdapter
     */
    add(t: T) {
        this.state.items.unshift(t)
        this.setState({
            items: this.state.items
        })
    }
    /**
     *
     *
     * @returns {ReactElement}
     * @memberof SearchAdapter
     */
    render(): ReactElement {

        const { parentNode, childNode } = this.props

        return cloneElement(parentNode, {
            ...parentNode.props,
        }, this.state.items.map((item, index) => cloneElement(childNode, {
            ...childNode.props,
            key: item.getId()
        }, item.onBind({ index, ...childNode.props, adapterProps: this.props }))))
    }
}
/** */
SearchAdapter.propTypes = {
    onClick: PropTypes.func,
    parentNode: PropTypes.element,
    childNode: PropTypes.element
}
/** */
SearchAdapter.defaultProps = {
    parentNode: <li />,
    childNode: <ul />
}

export default SearchAdapter