import querystring from "querystring";
import { info } from 'common/logger'

export const REQUEST_STARTED = 0;
export const REQUEST_SUCCESS = 1;
export const REQUEST_FAILED = 2;

export type ApiMetaData = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: {
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8";
  };
  credentials?: "include";
};

export type ApiActionCallbacks<T> = {
  successCallback?: (any) => Promise<T>;
  errorCallback?: (Error) => Promise<any>;
};

const request = <T>(
  endpoint: string,
  action: ApiMetaData = {
    method: "GET",
    body: undefined,
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    credentials: "include"
  },
  callbacks: ApiActionCallbacks<T> = undefined,
  progress: (status: number, data: any) => void = undefined
) => {

  var { body } = action;
  if (body) {
    body = querystring.stringify(body);
    action.body = body
  }

  info({
    name: "request info",
    msg: {endpoint, action, callbacks}
  })

  if (progress) progress(REQUEST_STARTED, null);

  const workOnError = err => {
    if (callbacks) {
      const { errorCallback } = callbacks;
      if (errorCallback)
        errorCallback(err).then(e => {
          if (progress) progress(REQUEST_FAILED, e);
        });
    } else {
      if (progress) progress(REQUEST_FAILED, err);
    }
  };

  fetch(endpoint, action)
    .then(data => {      
      if (callbacks) {
        const { successCallback } = callbacks;
        if (successCallback) {
          successCallback(data)
            .then(res => {
              info({
                name: "request response",
                msg: res
              })
              if (progress) progress(REQUEST_SUCCESS, res);
            })
            .catch(err => workOnError(err));
        }
      } else
        data.json().then(d => {
          info({
            name: "request response",
            msg: d
          })
          if (progress) progress(REQUEST_SUCCESS, d);
        });
    })
    .catch(err => workOnError(err));
};

export default request;
