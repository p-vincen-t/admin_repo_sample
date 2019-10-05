import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import CookieStore from 'stores/CookieStore';
import deepmerge from 'deepmerge';

const usingHighDensity = themeOptions => deepmerge(themeOptions, {
  props: {
    MuiButton: {
      size: 'small',
    },
    MuiFilledInput: {
      margin: 'dense',
    },
    MuiFormControl: {
      margin: 'dense',
    },
    MuiFormHelperText: {
      margin: 'dense',
    },
    MuiIconButton: {
      size: 'small',
    },
    MuiInputBase: {
      margin: 'dense',
    },
    MuiInputLabel: {
      margin: 'dense',
    },
    MuiListItem: {
      dense: true,
    },
    MuiOutlinedInput: {
      margin: 'dense',
    },
    MuiFab: {
      size: 'small',
    },
    MuiTable: {
      size: 'small',
    },
    MuiTextField: {
      margin: 'dense',
    },
    MuiToolbar: {
      variant: 'dense',
    },
  },
  overrides: {
    MuiIconButton: {
      sizeSmall: {
        // minimal touch target hit spacing
        marginLeft: 4,
        marginRight: 4,
        padding: 12,
      },
    }
  },
});

export const themeColor = '#115f93';

export const DispatchContext = React.createContext(() => {
  throw new Error('Forgot to wrap component in ThemeContext.Provider');
});

export function ThemeProvider(props) {

  const useEnhancedEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

  const themes = []

  themes['default'] = dir => ({
    direction: dir,
    nprogress: {
      color: '#000'
    },
    palette: {
      primary: {
        main: '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ffffff',
        contrastText: '#1565c0',
      },
      error: {
        main: '#c62828'
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
    }
  });

  themes['red'] = dir => ({
    direction: dir,
    nprogress: {
      color: '#000'
    },
    palette: {
      primary: {
        main: '#c62828',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ffffff',
        contrastText: '#c62828',
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
    }
  });

  const getTheme = (theme, dir) => createMuiTheme(usingHighDensity(themes[theme](dir)));

  const { children } = props;

  const nextTheme = CookieStore.get('theme') || 'default';
  const nextDir = CookieStore.get('dir') || 'ltr';

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
  }, { theme: nextTheme, dir: nextDir });

  const { theme, dir } = themeOptions;

  React.useEffect(() => {
    // Expose the theme as a global variable so people can play with it.
    if (process.browser) {
      window.theme = theme;
    }
    CookieStore.put('theme', theme)
  }, [theme]);

  useEnhancedEffect(() => {
    document.body.dir = dir;
    CookieStore.put('dir', dir)
  }, [dir]);

  const myTheme = React.useMemo(() => getTheme(theme, dir), [theme]);

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
