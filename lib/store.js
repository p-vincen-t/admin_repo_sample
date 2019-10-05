import { combineReducers } from "redux";
import { AuthReducer } from "appRedux/Auth";
import { ErrorReducer } from "appRedux/Error";
import { LayoutReducer } from "appRedux/Layout";
import { InventoryCatalogReducer } from "appRedux/dashboard/inventory/Catalog";

import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import { promiseMiddleware, httpMiddleware } from "lib/middleware";

const Reducer = combineReducers({
  auth: AuthReducer,
  layout: LayoutReducer,
  error: ErrorReducer,
  productCatalog: InventoryCatalogReducer
});

const isServer = typeof window === "undefined";
const __NEXT_REDUX_STORE__ = "__NEXT_REDUX_STORE__";

export default initialState => {
  if (isServer)
    return createStore(
      Reducer,
      initialState,
      composeWithDevTools(
        applyMiddleware(thunkMiddleware, httpMiddleware, promiseMiddleware)
      )
    );

  const store = createStore(
    Reducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(thunkMiddleware, httpMiddleware, promiseMiddleware)
    )
  );

  // store.__PERSISTOR = persistStore(store);
  // // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = store;
  }
  return window[__NEXT_REDUX_STORE__];
};
