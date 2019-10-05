import { FAILED, HTTP_ACTION, RECEIVED, REQUESTED } from "appRedux/ApiAction";
import request, { ApiMetaData, REQUEST_FAILED, REQUEST_STARTED, REQUEST_SUCCESS } from "common/fetch";

/**
 *
 * @param _
 */
const promiseMiddleware = _ => next => action => {
  if (isPromise(action.promise)) {
    action.promise.then(
      res => {
        action.res = res;
        next(action);
      },
      error => {
        action.err = error;
        next(action);
      }
    );

    return;
  }

  next(action);
};
/**
 *
 * @param v
 */
function isPromise(v) {
  return v && typeof v.then === "function";
}
/**
 *
 * @param _
 */

const httpMiddleware = _ => next => action => {
  if (action[HTTP_ACTION]) {
    const { HTTP_ACTION, endpoint, type, HTTP_ACTION_CALLBACKS } = action;

    let fetchData: ApiMetaData = {
      method: HTTP_ACTION.method,
      headers: HTTP_ACTION.headers || [],
      body: HTTP_ACTION.body || null,
      credentials: HTTP_ACTION.credentials
    };

   request(endpoint, fetchData, HTTP_ACTION_CALLBACKS, (status, data) => {
      if (status === REQUEST_STARTED)
        next({
          type: type + REQUESTED
        });
      else if (status === REQUEST_SUCCESS)
        next({
          type: type + RECEIVED,
          payload: data
        });
      else if (status === REQUEST_FAILED)
        next({
          type: type + FAILED,
          error: data
        });
    });
  } else return next(action);
};

export { promiseMiddleware, httpMiddleware };

