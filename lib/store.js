import { AuthReducer } from 'appRedux/Auth';
import { InventoryCatalogReducer } from 'appRedux/dashboard/inventory/Catalog';
import { ErrorReducer } from 'appRedux/Error';
import { LayoutReducer } from 'appRedux/Layout';
// import { persistReducer, persistStore } from "redux-persist";
// const storage = require("redux-persist/lib/storage");
import { httpMiddleware, promiseMiddleware } from 'lib/middleware';
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";



const reducer = combineReducers({
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
      reducer,
      initialState,
      composeWithDevTools(
        applyMiddleware(thunkMiddleware, httpMiddleware, promiseMiddleware)
      )
    );


  // store.__PERSISTOR = persistStore(store);
  // // Create store if unavailable on the client and set it on the window object
  if (window[__NEXT_REDUX_STORE__]) {
    return window[__NEXT_REDUX_STORE__];
  }

  const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(thunkMiddleware, httpMiddleware, promiseMiddleware)
    )
  );

  window[__NEXT_REDUX_STORE__] = store;
  return window[__NEXT_REDUX_STORE__];
};
