import { AnyAction } from "redux";
import LocalStorageStore, { DEVICE_KEY } from "../base/pref/LocalStorageStore";
import ApiAction, { FAILED, RECEIVED, REQUESTED } from "./ApiAction";
import CookieStore, { REFRESH_TOKEN } from "../base/pref/CookieStore";
/**
 * auth constants
 */
const LOGIN = "LOGIN";
export const AuthConstants = {
  // for notifiying errors during authentication
  AUTH_INPUT_ERRORS: "AUTH_INPUT_ERRORS",
  AUTH_LOGGEDIN_FALSE: "LOGIN_TO_FALSE",
  // for notifying autentication stated
  LOGIN_REQUEST: LOGIN + REQUESTED,
  // for notifying authentication succeded
  LOGIN_SUCCESS: LOGIN + RECEIVED,
  // for notifying aithentication failed
  LOGIN_FAILURE: LOGIN + FAILED,
  // for notifying logout request
  LOGOUT: "LOGOUT"
};
/**
 * the auth reducers manages authentication state
 *
 * @param {{}} [state={ loggedIn: false, errors: {} }] initial state for authentication
 * @param {AnyAction} action auth actions
 * @returns
 */
export const AuthReducer = (
  state: {} = { loggedIn: false, errors: {} },
  action: AnyAction
) => {
  switch (action.type) {
    case AuthConstants.AUTH_LOGGEDIN_FALSE:
      return {
        ...state,
        loggedIn: false,
        user: undefined
      };
    // when there are errors in authentication, return the state
    // and errors payload in it
    case AuthConstants.AUTH_INPUT_ERRORS:
      return {
        ...state,
        errors: {
          identifierError: action.errors.identifierError,
          passwordError: action.errors.passwordError
        }
      };
    case AuthConstants.LOGIN_REQUEST:
      return {
        ...state,
        loading: true
      };
    case AuthConstants.LOGIN_SUCCESS:
      const { user } = action.payload;
      return {
        ...state,
        loggedIn: true,
        loading: false,
        user
      };
    case AuthConstants.LOGIN_FAILURE:
      if (action.error.status == 404) {
        return {
          ...state,
          loggingIn: false,
          errors: {
            identifierError: "Could not find your account"
          }
        };
      } else
        return {
          ...state,
          loggingIn: false,
          errors: {
            passwordError: "You provided a wrong password"
          }
        };
    case AuthConstants.LOGOUT:
      return {};
    default:
      return state;
  }
};
/**
 *
 */
const AuthActions = {
  setLoggedIntoFalse: () => dispatch => {
    dispatch({ type: AuthConstants.AUTH_LOGGEDIN_FALSE });
  },
  login: (identifier: string, password: string, successCb: () => void) => (
    dispatch: any
  ) => {
    if (!identifier)
      return dispatch({
        type: AuthConstants.AUTH_INPUT_ERRORS,
        errors: {
          identifierError: "Email or Phone number is required"
        }
      });
    if (!password)
      return dispatch({
        type: AuthConstants.AUTH_INPUT_ERRORS,
        errors: {
          passwordError: "Password is required"
        }
      });
    const deviceId = LocalStorageStore.get(DEVICE_KEY);
    dispatch(
      ApiAction(
        LOGIN,
        "/auth/login",
        {
          method: "POST",
          body: {
            identifier,
            password,
            deviceId
          }
        },
        {
          successCallback: res =>
            new Promise((resolve, reject) => {
              const status = res.status;
              if (status == 200)
                res.json().then(r => {
                  CookieStore.put(REFRESH_TOKEN, r.refresh_token);
                  successCb();
                  resolve({ user: { ...r.user, id: undefined } });
                });
              else if (status == 404) {
                reject({ error: { status: 404 } });
              } else reject({ error: { status: 403 } });
            })
        }
      )
    );
    // dispatch({ type: AuthConstants.LOGIN_REQUEST });
    // AuthService.login(identifier, password, deviceId).then(user =>
    //   dispatch({ type: AuthConstants.LOGIN_SUCCESS, user }),
    //   error => dispatch({ type: AuthConstants.LOGIN_FAILURE, error }))
  }
};

export default AuthActions;
