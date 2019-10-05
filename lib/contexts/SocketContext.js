import { initSocketService } from "lib/services";
import PropTypes from 'prop-types';
import React from 'react';

export const SocketContext = React.createContext(() => {
  throw new Error('Forgot to wrap component in SocketContext.Provider');
});

export function SocketProvider(props) {

  const { children, store } = props;

  const [socket, setSocket] = React.useState(null)

  React.useEffect(() => {
    setSocket(initSocketService(store.dispatch));
  }, [])

  const mySocket = React.useMemo(() => {
    return socket
  }, []);

  return (
    <SocketContext.Provider value={mySocket}>
      {children}
    </SocketContext.Provider>
  );
}

SocketProvider.propTypes = {
  children: PropTypes.node,
  store: PropTypes.any
};


