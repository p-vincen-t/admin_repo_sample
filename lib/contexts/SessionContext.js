import PropTypes from "prop-types";
import React, { Fragment } from "react";
import CookieStore, { USER } from "stores/CookieStore";
import request, { REQUEST_SUCCESS, REQUEST_FAILED } from "common/fetch";

export const SessionContext = React.createContext(() => {
  throw new Error("Forgot to wrap component in SessionContext.Provider");
});

export function SessionProvider(props) {
  const { children } = props;

  const [user, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    request(`/auth/verify?user=${CookieStore.get(USER)}`, undefined, undefined, (status, data) => {
      if (status === REQUEST_SUCCESS) setResponse(data);
      else if (status === REQUEST_FAILED) setError(data);
    });
  }, []);

  const session = React.useMemo(() => {
    return {user}
  }, [user]);

  return (
    <Fragment>
      {user ? (
        <SessionContext.Provider value={session}>
        {children}
        </SessionContext.Provider>
      ) : (
        <Fragment>
          <div>loading, please wait</div>
          {error ? error : ""}
        </Fragment>
      )}
    </Fragment>
  );
}

SessionProvider.propTypes = {
  children: PropTypes.node
};

export const useSession = () => React.useContext(SessionContext)
