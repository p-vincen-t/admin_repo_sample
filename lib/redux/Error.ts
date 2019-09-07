import { AnyAction } from "redux";

export const ErrorConstants = {
  FATAL: "FATAL",
  ERROR: "ERROR",
  NOT_FOUND: "NOT_FOUND",
  ACCESS_DENIED: "ACCESS_DENIED"
};

export const ErrorReducer = (state = {}, action: AnyAction) => {
  switch (action.type) {
    case ErrorConstants.FATAL:
      return {
        ...state,
        fatal: action.error
      };
    case ErrorConstants.ERROR:
      return {
        ...state,
        status: action.error.status,
        message: action.error.message
      };
    case ErrorConstants.NOT_FOUND:
      return {};
    case ErrorConstants.ACCESS_DENIED:
      return {};
    default:
      return state;
  }
};

const ErrorActions = {
  fatalError: (_: any) => dispatch => dispatch({ type: ErrorConstants.FATAL }),
  error: (message: string) => dispatch =>
    dispatch({ type: ErrorConstants.ERROR, message }),
  notFound: (message: any) => dispatch =>
    dispatch({ type: ErrorConstants.NOT_FOUND, message }),
  accessDenied: (message: any) => dispatch =>
    dispatch({ type: ErrorConstants.ACCESS_DENIED, message })
};

export default ErrorActions;
