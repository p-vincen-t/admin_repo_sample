// import { SheetsRegistry } from 'jss';
import { createMuiTheme } from '@material-ui/core/styles';
import { createGenerateClassName } from '@material-ui/styles';
// import { blue, yellow } from '@material-ui/core/colors'
import { SheetsRegistry } from 'react-jss/lib/jss'
// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({  
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

const redTheme = createMuiTheme({  
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

function createPageContext(type) {
  let t
  if (type === "default" ) t = theme
  else if (type === "red" ) t = redTheme
  else t = theme
  return {
    theme: t,
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
    sheetsManager: new Map()
  };
}

let pageContext;

export default function getPageContext(type) {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext(type);
  }

  // Reuse context on the client-side.
  if (!pageContext) {
    pageContext = createPageContext(type);
  }

  return pageContext;
}
