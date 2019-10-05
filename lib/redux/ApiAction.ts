import { ApiMetaData, ApiActionCallbacks } from "common/fetch";

export const HTTP_ACTION = "HTTP_ACTION";
export const HTTP_ACTION_CALLBACKS = "HTTP_ACTION_CALLBACKS";
export const REQUESTED = "_REQUESTED";
export const RECEIVED = "_RECEIVED";
export const FAILED = "_FAILED";

export default <T>(
  type: string,
  endpoint: string,
  action?: ApiMetaData,
  callbacks?: ApiActionCallbacks<T>
) => {
  return {
    type,
    endpoint,
    HTTP_ACTION: action
      ? Object.assign(
          {},
          {
            endpoint: undefined,
            method: "GET",
            body: undefined,
            headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            credentials: "include"
          },
          action
        )
      : {
          endpoint: undefined,
          method: "GET",
          body: undefined,
          headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          credentials: "include"
        },
    HTTP_ACTION_CALLBACKS: callbacks
  };
};
