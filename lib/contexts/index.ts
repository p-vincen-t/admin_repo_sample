import React from 'react';
import User from 'models/User';

let user: User = undefined

let showSnackBar: (message, duration, variant , position) => void = undefined

export const UserContext = React.createContext({
  user
});

export const ShowSnackBarContext = React.createContext(showSnackBar)

export const PageContext = React.createContext({
    activePage: {
      pathname: '',
    },
    pages: [],
  });
  
  
