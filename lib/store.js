import { combineReducers } from "redux";
import { AuthReducer } from 'appRedux/Auth';
import { ErrorReducer } from 'appRedux/Error';
import { LayoutReducer } from 'appRedux/Layout';
import { InventoryCatalogReducer } from 'appRedux/dashboard/inventory/Catalog';

import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import { persistReducer, persistStore } from "redux-persist";
const storage = require("redux-persist/lib/storage");

import { promiseMiddleware, httpMiddleware } from 'lib/middleware';

const serverReducer = combineReducers({
  auth: AuthReducer,
  layout: LayoutReducer,
  error: ErrorReducer,
  productCatalog: InventoryCatalogReducer
});

const clientReducer = combineReducers({
  auth: persistReducer(
    {
      key: "root",
      storage,
      whitelist: ["user"]
    },
    AuthReducer
  ),
  layout: LayoutReducer,
  error: ErrorReducer,
  productCatalog: InventoryCatalogReducer
});

const isServer = typeof window === "undefined";
const __NEXT_REDUX_STORE__ = "__NEXT_REDUX_STORE__";

export default initialState => {
  if (isServer)
    return createStore(
      serverReducer,
      initialState,
      composeWithDevTools(
        applyMiddleware(thunkMiddleware, httpMiddleware, promiseMiddleware)
      )
    );

  const store = createStore(
    clientReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(thunkMiddleware, httpMiddleware, promiseMiddleware)
    )
  );

  store.__PERSISTOR = persistStore(store);
  // // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = store;
  }
  return window[__NEXT_REDUX_STORE__];
};
