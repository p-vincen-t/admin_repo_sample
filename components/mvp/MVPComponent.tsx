import { Component } from "react";
/**
 *
 *
 * @export
 * @interface BaseView
 */
export interface BaseView {
  /**
   * compose the view with passed in payload
   *
   * @param {{}} [payload]
   * @returns {*}
   * @memberof BaseView
   */
  compose(): void;
  /**
   *
   *
   * @returns {*}
   * @memberof BaseView
   */
  decompose(): void;
}
/**
 *
 *
 * @export
 * @class BasePrsenter
 * @template T
 */
export class BasePresenter<T extends BaseView> {
  /**
   *Creates an instance of BasePresenter.
   * @param {T} baseView
   * @memberof BasePresenter
   */
  constructor(private baseView: T) {}
  /**
   *
   *
   * @memberof BasePresenter
   */
  view = (): T => this.baseView;
  /**
   *
   *
   * @memberof BasePresenter
   */
  decompose() {
    this.baseView.decompose();
  }
  /**
   *
   *
   * @param {{}} [payload]
   * @memberof BasePresenter
   */
  compose() {
    this.baseView.compose();
  }
}

/**
 *
 *
 * @export
 * @abstract
 * @class MVPComponent
 * @extends {Component}
 * @template T
 */
export default abstract class MVPComponent<
  T extends BasePresenter<any>,
  P = {},
  S = {}
> extends Component<P, S> {
  /**
   *Creates an instance of MVPComponent.
   * @param {P} props
   * @memberof MVPComponent
   */
  constructor(props: P) {
    super(props);
  }
  /**
   *
   *
   * @memberof MVPComponent
   */
  componentWillUnmount() {
    this.presenter().decompose();
  }
  /**
   *
   *
   * @memberof MVPComponent
   */
  componentWillMount() {
    this.presenter().compose();
  }
  /**
   *
   *
   * @abstract
   * @returns {T}
   * @memberof MVPComponent
   */
  abstract presenter(): T;
}
