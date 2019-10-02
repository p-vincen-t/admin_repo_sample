import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import CookieStore from 'stores/CookieStore';

const defaultTheme = dir => createMuiTheme({
  direction: dir,
  nprogress: {
    color: '#000'
  },
  palette: {
    primary: {
      light: '#518cc4',
      main: '#115f93',
      dark: '#003665',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ffff5e',
      main: '#f7ce23',
      dark: '#c09d00',
      contrastText: '#000000',
    },
    error: {
      main: '#f44336'
    },
    background: {
      default: "#F5F5F5"
    },
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
  },
  typography: {
    useNextVariants: true,
    fontSize: 14,
  },
});

const redTheme = dir => createMuiTheme({
  direction: dir,
  nprogress: {
    color: '#000'
  },
  palette: {
    primary: {
      light: '#518cc4',
      main: '#f44336',
      dark: '#003665',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ffff5e',
      main: '#f7ce23',
      dark: '#c09d00',
      contrastText: '#000000',
    },
    error: {
      main: '#115f93'
    },
    background: {
      default: "#F5F5F5"
    },
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
  },
  typography: {
    useNextVariants: true,
    fontSize: 14,
  },
});

export const themeColor = '#115f93';


export const DispatchContext = React.createContext(() => {
  throw new Error('Forgot to wrap component in ThemeContext.Provider');
});

const useEnhancedEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export function ThemeProvider(props) {

  const { children } = props;

  const [themeOptions, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case 'SET_THEME':
        return {
          ...state,
          theme: action.theme,
        };
      case 'SET_DIRECTION': {
        return {
          ...state,
          dir: action.dir,
        };
      }
      case 'CHANGE':
        return {
          ...state,
          theme: action.theme,
          dir: action.dir
        };
      case 'RESET_THEME':
        return {
          ...state,
          theme: 'default',
          dir: 'ltr'
        };
      default:
        throw new Error(`Unrecognized type ${action.type}`);
    }
  }, { theme: 'default', dir: 'ltr' });

  const { theme, dir } = themeOptions;

  React.useEffect(() => {
    if (process.browser) {
      const nextTheme = CookieStore.get('theme') || 'default';
      const nextDir = CookieStore.get('dir') || 'ltr';

      dispatch({
        type: 'CHANGE',
        theme: nextTheme,
        dir: nextDir
      });
    }
  }, []);

  React.useEffect(() => {
    // Expose the theme as a global variable so people can play with it.
    if (process.browser) {
      window.theme = theme;
    }
    CookieStore.put('theme', theme)
  }, [theme]);

  useEnhancedEffect(() => {
    document.body.dir = dir;
  }, [dir]);

  const myTheme = React.useMemo(() => {
    if (theme === 'red') return redTheme(dir)
    else return defaultTheme(dir)
  }, [dir, theme]);

  return (
    <MuiThemeProvider theme={myTheme}>
      <CssBaseline />
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </MuiThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export function useChangeTheme() {
  const dispatch = React.useContext(DispatchContext);
  return React.useCallback(({ theme, dir }) => {
    if (theme && dir) dispatch({ type: 'CHANGE', theme, dir })
    else if (theme) dispatch({ type: 'SET_THEME', theme })
    else if (dir) dispatch({ type: 'SET_DIRECTION', dir })
    else dispatch({ type: 'RESET_THEME' })
  }, [dispatch]);
}
