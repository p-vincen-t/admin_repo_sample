import { AnyAction } from "redux";

export const CatalogConstants = {
  LOAD_MORE: "LOAD_MORE_CATALOG",
  LOAD_MORE_COMPLETE: "LOAD_MORE_CATALOG_COMPLETE",
  LOAD_ERROR: "LOAD_MORE_CATALOG_ERROR",
  ADD_PRODUCT: "ADD_PRODUCT_CATALOG",
  UPDATE_PRODUCT: "UPDATE_PRODUCT_CATALOG",
  REMOVE_PRODUCT: "REMOVE_PRODUCT_CATALOG",
  CLEAR_PRODUCTS: "CLEAR_PRODUCT_CATALOG"
};

export const InventoryCatalogReducer = (
  state = {
    products: []
  },
  action: AnyAction
) => {
  switch (action.type) {
    case CatalogConstants.LOAD_MORE:
      return {
        ...state,
        loading: true
      };
    case CatalogConstants.LOAD_MORE_COMPLETE:
      return {
        ...state,
        loding: false,
        products: state.products.push(action.products)
      };
    case CatalogConstants.ADD_PRODUCT:
      return {
        ...state
      };
    default:
      return state;
  }
};

const CatalogActions = {
  loadMore: (_offset: number, _limit: number) => (dispatch: any) => {
    dispatch({ type: CatalogConstants.LOAD_MORE });
    // InventoryCalalogStore.all({ offset, limit}, (products, info) => {
    //   dispatch({ type: CatalogConstants.LOAD_MORE_COMPLETE}, products, info)
    // }, (err => {
    //   dispatch({ type: CatalogConstants.LOAD_MORE}, err)
    // }))
  }
};

export default CatalogActions;
